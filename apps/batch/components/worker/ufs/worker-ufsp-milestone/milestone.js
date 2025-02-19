const { workerData } = require('worker_threads');

const { config, common } = require("../../../helpers");

const { repository } = require("./resources/integrations");
const { util } = require("./resources");
const { GET_PIPELINE_TX_PGM_CODE } = require("./resources/types/constant");

const { convertCurrentTimeToUFSPFormat } = require("@repo/kwe-lib/components/dataFormatter.js");
const { sleep } = require('@repo/kwe-lib/components/sleep.js');

const Teams = require("../../../notification/teams");
const Library = require("../../../ufspLibrary/ufsLibray");

const teams = new Teams("INSERT_USFP_MILESTONE");
const ufsp = new Library(workerData);

const INTERVAL = 60000;

const excuteState = {
    onExcute: false
};

const insertMilestone = async () => {
    try {
    teams.restart();
    /**
     * @SECTION
     * Process : 1
     * Summary : milestone 입력 대상 및 등록 정보 조회.
     */
    let process = "milestone 입력 대상 및 등록 정보 조회.";

    const mileStonetList = await repository.getMilestoneList(ufsp.pgm, ufsp.idx)
        .catch(ex => {
            // TEAMS
            teams.addProcessResult(process, 'error', false);
            throw ex;
        });

    if (!mileStonetList || mileStonetList.length === 0) {
        return;
    }

    // TEAMS
    teams.addProcessResult(process);

    /**
     * @dev
     * 유저별로 USFP에 로그인하여 유저 이름으로 마일스톤을 등록하기 위한 그룹화.
     */
    const createUserGroupedArray = mileStonetList.reduce((accumulator, current) => {
        const standard = current.create_user;
        if (!accumulator[standard]) {
            accumulator[standard] = [];
        }

        accumulator[standard].push(current);

        return accumulator;
    }, {});

    /**
     * @SECTION
     * Process : 2
     * Summary : USFP 마일스톤 등록
     */
    process = "USFP 마일스톤 등록";

    const script = await ufsp.getScript();

    const ifDatas = await ufsp.getIFData();

    const insertedMilstoneArray = [];
    const notInsertedMilestoneArray = [];
    const duplicateMilestoneArray = [];
    for (let create_user in createUserGroupedArray) {
        await ufsp.loginByApi(create_user, false)
            .catch(ex => {
                // TEAMS
                teams.addProcessResult(process, 'error', false);
                throw ex;
            });
        
        for (let value of createUserGroupedArray[create_user]) {
            ufsp.resultData = {};

            for (let data of ifDatas) {
                if (data.bl_no === value.waybill_no) {
                    ufsp.mainData = data;
                    break;
                }
            }

            const checkScript = await repository.getScriptAPI(GET_PIPELINE_TX_PGM_CODE)
                .catch(ex => {
                    // TEAMS
                    teams.addProcessResult(process, value, false);
                    throw ex;
                });

            await ufsp.addJsonResult('hwb_no', '', '', value.waybill_no, 'addBulk');
            await ufsp.startScript(checkScript)
                .catch(ex => {
                    /**
                     * @dev
                     * milestone 등록하려는 waybill이 존재하지 않을 경우 t_edi_history 원복.
                     */
                    // TEAMS
                    teams.addProcessResult(process, value, false);
                    throw ex;
                });
            const pipelineTX = await ufsp.resultData.get_pipeline_tx_result;

            await sleep(3000);

            ufsp.resultData = {};

            const row = util.setInsertMilestoneRow(value, ufsp.ufsId, pipelineTX[0].id);

            await ufsp.addJsonResult('insert_time', '', '', convertCurrentTimeToUFSPFormat(), 'addBulk');
            await ufsp.addJsonResult('insert_data', '', '', row, 'addBulk');

            await ufsp.startScript(script)
                .catch(ex => {
                    // TEAMS
                    teams.addProcessResult(process, 'error', false);
                    throw ex;
                });

            const result = await ufsp.resultData.milestone_insert_result[0];

            if (Array.isArray(result) && result.length === 0) {
                if (!(insertedMilstoneArray.includes(value.waybill_no))) {
                    insertedMilstoneArray.push(value.waybill_no);
                }
            } else if (!Array.isArray(result) && result.sev === 3 && result.message !== null) {
                if (!(notInsertedMilestoneArray.includes(value.waybill_no))) {
                    notInsertedMilestoneArray.push(value.waybill_no.concat(`(${value.milestone})`).concat(" : ").concat(result.message));
                }
            } else { 
                duplicateMilestoneArray.push(value.waybill_no);
            }

            await sleep(3000);
        }
        teams.addProcessResult(`${create_user}`, `${JSON.stringify(createUserGroupedArray[create_user])}`);
    }

    if (duplicateMilestoneArray.length !== 0) {
        teams.addProcessResult("중복 등록 milestone 발생", JSON.stringify(duplicateMilestoneArray), false);
    }

    if (notInsertedMilestoneArray.length !== 0) {
        teams.addProcessResult("미등록 milestone 발생", JSON.stringify(notInsertedMilestoneArray), false);
    }

    /**
     * @SECTION
     * Process : 3
     * Summary : 등록된 milestone t_edi_history, t_hbl_milestone_queue if_yn = 'Y' 처리.
     */
    process = "등록 data if_yn Y 처리";

    await repository.setMilestoneIfData(insertedMilstoneArray.join(' '), ufsp.idx)
        .catch(ex => {
            // TEAMS
            teams.addProcessResult(process, 'error', false);
            throw ex;
        });
    // TEAMS
    teams.addProcessResult(process);

    /**
     * @SECTION
     * Process : 4
     * Summary : 등록된 milestone 데이터 검증을 위한 UFSP hawb milestone interface
     */
    process = "UFSP milestone data interface setting";
    
    for (hawbNo of insertedMilstoneArray) {
        await repository.setMilestoneInterfaceIfData(hawbNo)
            .catch(ex => {
                // TEAMS
                teams.addProcessResult(process, "error", false);
                throw ex;
            });
    }
    
    // TEAMS
    teams.sendMessage(process);

    return;
    } catch (ex) {
        /**
         * @dev
         * ^ 에러 발생 시 return.
         */
        teams.sendMessage("배치 실행 에러", ex.toString());
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