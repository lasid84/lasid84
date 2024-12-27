const { getServerIP } = require("../../../../../helpers/common");
const { executFunction } = require("../../../../../api.service/api.service");

const serverIP = getServerIP();
const USER_ID = "MILESTONE_BATCH";

/**
 * @Function
 * Summary : pgmCode에 따른 외부 API 호출을 위한 API Info 조회.
 * Detail : UFSP 마일스톤 등록을 위한 HAWB PIPELINE TX 관련 script info 조회.
 */
const getScriptAPI = async (pgmCode) => {
    try {
        const params = {
            inparam: ['in_pgm_code', 'in_user_id', 'in_ipaddr'],
            invalue: [pgmCode, USER_ID, serverIP],
            inproc: 'scrap.f_scrp0002_get_script_api',
        };

        const cursorData = await executFunction(params.inproc, params.inparam, params.invalue);

        return cursorData[1].data;
    } catch (ex) {
        throw ex;
    }
};

/**
 * @Function
 * Summary : t_edi_history에 담긴 milestone 조회가 필요한 hawb 목록 조회
 */
const getMilestoneTargetList = async (pgm) => {
    try {
        const params = {
            inparam: ["in_pgm", "in_user", "in_ipaddr"],
            invalue: [pgm, USER_ID, serverIP],
            inproc: "scrap.f_scrp1002_get_milestone_target_list",
        };

        const cursorData = await executFunction(params.inproc, params.inparam, params.invalue);

        return cursorData[0].data[0].list;
    } catch (ex) {
        throw ex;
    }
};

/**
 * @Function
 * Summary : 등록 예정 hawb 리스트에 해당하는 milestone 값 조회.
 */
const getMilestoneValueList = async (hawbList) => {
    try {
        const params = {
            inparam: ["in_hawb_list", "in_user", "in_ipaddr"],
            invalue: [hawbList, USER_ID, serverIP],
            inproc: "scrap.f_scrp1002_get_milestone_value_list",
        };

        const cursorData =  await executFunction(params.inproc, params.inparam, params.invalue);
        
        return cursorData[0].data;
    } catch (ex) {
        throw ex;
    }
};

/**
 * @Function
 * Summary : UFSP에 등록된 마일스톤 if_yn 상태값 Y로 변경.
 */
const setMilestoneIfData = async (insertedList) => {
    try {
        const params = {
            inparam: ["in_hawb_list", "in_user", "in_ipaddr"],
            invalue: [insertedList, USER_ID, serverIP],
            inproc: "scrap.f_scrp1002_set_milestone_if_data"
        };

        await executFunction(params.inproc, params.inparam, params.invalue);
    } catch (ex) {
        throw ex;
    }
};

module.exports = {
    getScriptAPI,
    getMilestoneTargetList,
    getMilestoneValueList,
    setMilestoneIfData
}