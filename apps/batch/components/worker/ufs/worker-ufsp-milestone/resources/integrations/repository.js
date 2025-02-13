const { getServerIP } = require("../../../../../helpers/common");
const { executFunction, executeKREAMFunction } = require("../../../../../api.service/api.service");

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
 * Summary : t_edi_history -> 등록 대상 조회 및 t_hbl_milestone_queue -> 등록 정보 조회.
 */
const getMilestoneList = async (pgm, idx) => {
    try {
        const params = {
            inparam: ["in_pgm", "in_idx", "in_user", "in_ipaddr"],
            invalue: [pgm, idx, USER_ID, serverIP],
            inproc: "scrap.f_scrp1002_get_milestone_list",
        };

        const cursorData = await executFunction(params.inproc, params.inparam, params.invalue);
        console.log("cursorData : ", cursorData);

        return cursorData[0].data[0].list;
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

/**
 * @Function
 * Summary : UFSP에 등록된 마일스톤 데이터 검증을 위한 interface setting.
 */
const setMilestoneInterfaceIfData = async (hwabNo) => {
    try {
        const params = {
            inparam: ["in_pgm_code", "in_blno", "in_user_id", "in_ipaddr"],
            invalue: ["0", hwabNo, USER_ID, serverIP],
            inproc: "scrap.f_scrp0001_ins_if_data"
        };

        const result = await executFunction(params.inproc, params.inparam, params.invalue);
        return result[0];
    } catch (ex) {
        throw ex;
    }
}

module.exports = {
    getScriptAPI,
    getMilestoneList,
    setMilestoneIfData,
    setMilestoneInterfaceIfData
}