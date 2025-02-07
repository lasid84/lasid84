const { workerData } = require('worker_threads');

const { config, common } = require("../../../helpers");

const { repository } = require("./resources/integrations");
const { util } = require("./resources");
const { GET_PIPELINE_TX_PGM_CODE } = require("./resources/types/constant");

const { convertCurrentTimeToUFSPFormat } = require("@repo/kwe-lib/components/dataFormatter.js");
const { sleep } = require('@repo/kwe-lib/components/sleep.js');

const Teams = require("../../../notification/teams");
const Library = require("../../../ufspLibrary/ufsLibray");

const ufsp = new Library(workerData);

const INTERVAL = 10000;

const excuteState = {
    onExcute: false
};

const insertMilestone = async () => {
    try {
    const teams = new Teams("INSERT_USFP_MILESTONE");

    /**
     * @SECTION
     * Process : 1
     * Summary : milestone을 입력할 대상 hawb 조회.
     */
    const process1 = "milestone을 입력할 대상 hawb 조회";

    const mileStoneTargetList = await repository.getMilestoneTargetList(ufsp.pgm)
        .catch(ex => {
            // TEAMS
            teams.sendMessage(process1, ex);
            throw "error";
        });

    if (!mileStoneTargetList || mileStoneTargetList.length === 0) {
        return;
    }

    // TEAMS
    teams.addProcessResult(process1);

    /**
     * @SECTION
     * Process : 2
     * Summary : 대상 hawb에 해당하는 등록할 milestone 조회.
     */
    const process2 = "대상 hawb에 해당하는 등록할 milestone 조회";

    const mileStoneValueList = await repository.getMilestoneValueList(mileStoneTargetList.join(" "))
        .catch(ex => {
            // TEAMS
            teams.sendMessage(process2, ex);
            throw "error";
        });

    if (!mileStoneValueList || mileStoneValueList.length === 0) {
        return;
    }
    
    // TEAMS
    teams.addProcessResult(process2);

    /**
     * @dev
     * 유저별로 USFP에 로그인하여 유저 이름으로 마일스톤을 등록하기 위한 그룹화.
     */
    const createUserGroupedArray = mileStoneValueList.reduce((accumulator, current) => {
        const standard = current.create_user;
        if (!accumulator[standard]) {
            accumulator[standard] = [];
        }

        accumulator[standard].push(current);

        return accumulator;
    }, {});

    /**
     * @SECTION
     * Process : 3
     * Summary : USFP 마일스톤 등록
     */
    const process3 = "USFP 마일스톤 등록";

    const script = await ufsp.getScript();

    const insertedMilstoneArray = [];
    const duplicateMilestoneArray = [];
    for (let create_user in createUserGroupedArray) {
        await ufsp.loginByApi(create_user, false)
            .catch(ex => {
                // TEAMS
                teams.sendMessage("USFP 로그인 실패", ex, false);
                throw "error";
            });
        
        for (let value of createUserGroupedArray[create_user]) {
            ufsp.resultData = {};

            const checkScript = await repository.getScriptAPI(GET_PIPELINE_TX_PGM_CODE)
                .catch(ex => {
                    // TEAMS
                    teams.sendMessage(process3, ex);
                    throw ex;
                });

            await ufsp.addJsonResult('hwb_no', '', '', value.waybill_no, 'addBulk');
            await ufsp.startScript(checkScript);
            const pipelineTX = await ufsp.resultData.get_pipeline_tx_result;

            await sleep(3000);

            ufsp.resultData = {};

            const row = util.setInsertMilestoneRow(value, ufsp.ufsId, pipelineTX[0].id);

            await ufsp.addJsonResult('insert_time', '', '', convertCurrentTimeToUFSPFormat(), 'addBulk');
            await ufsp.addJsonResult('insert_data', '', '', row, 'addBulk');

            await ufsp.startScript(script)
                .catch(ex => {
                    // TEAMS
                    teams.sendMessage(process3, ex, false);
                    throw "error";
                });

            const result = await ufsp.resultData.milestone_insert_result[0];

            if (Array.isArray(result) && result.length === 0) {
                insertedMilstoneArray.push(value.waybill_no);
            } else { 
                duplicateMilestoneArray.push(value.waybill_no);
            }

            await sleep(3000);
        }
    }

    if (duplicateMilestoneArray.length !== 0) {
        teams.addProcessResult("중복 등록 milestone 발생", JSON.stringify(duplicateMilestoneArray));
    }

    // TEAMS
    teams.addProcessResult(process3);

    /**
     * @SECTION
     * Process : 4
     * Summary : 등록된 milestone t_edi_history, t_hbl_milestone_queue if_yn = 'Y' 처리.
     */
    const process4 = "등록 data if_yn Y 처리";

    await repository.setMilestoneIfData(insertedMilstoneArray.join(' '))
        .catch(ex => {
            // TEAMS
            teams.sendMessage(process4, ex, false);
            throw "error";
        });
    // TEAMS
    teams.addProcessResult(process4);

    /**
     * @SECTION
     * Process : 5
     * Summary : 등록된 milestone 데이터 검증을 위한 UFSP hawb milestone interface
     */
    const process5 = "UFSP milestone data interface setting";
    
    for (hawbNo of insertedMilstoneArray) {
        await repository.setMilestoneInterfaceIfData(hawbNo)
            .catch(ex => {
                // TEAMS
                teams.sendMessage(process5, ex, false);
                throw ex;
            });
    }
    
    // TEAMS
    teams.sendMessage(process4);

    return;
    } catch (ex) {
        /**
         * @dev
         * ^ 에러 발생 시 return.
         */
        console.log("ex : ", ex);
        return;
    }
};

try {
    /**
     * @dev
     * Proxy 함수 설정 및 interval 무한 반복 시작.
     * [ Details ]
     * 배치 서버 최초 실행 시 Proxy 함수 즉시 실행.
     */
    const proxyFn = config.registerProxyFunction(insertMilestone, excuteState);
    proxyFn();
    config.setBatchInterval(proxyFn, INTERVAL);

    /**
     * @dev
     * 에러 전역 핸들러 등록.
     */
    Object.entries(config.commonProcessHandler).forEach(([eventName, handler]) => {
        const addCloseUFSP = async (...args) => {
            await ufsp.close();
            handler(...args);
        };
        process.on(eventName, addCloseUFSP);
    });
} catch (ex) {
    error(ex);
}