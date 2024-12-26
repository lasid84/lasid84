const { getServerIP } = require("../../../../helpers/common");

const { executFunction } = require("../../../../api.service/api.service");

const serverIP = getServerIP();
const USER_ID = "EXCHANGE_BATCH";

/**
 * @Function
 * Summary : 외부 API 호출을 위한 정보 DB 조회 함수.
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
 * Summary : 공휴일 데이터 DB 조회 함수. 
 */
const getHolidayDate = async (today) => {
    try {
        const params = {
            inparam: ["in_today", "in_type", "in_user", "in_ipaddr"],
            invalue: [today, "", USER_ID, serverIP],
            inproc: "public.f_exchange_rate_get_holiday",
        };

        const cursorData = await executFunction(params.inproc, params.inparam, params.invalue);

        return cursorData[0].data;
    } catch (ex) {
        throw ex;
    }
};

/**
 * @function
 * Summary : 통화 정보를 가져오기 위한 DB 조회 함수.
 */
const getCurrencyInfo = async () => {
    try {
        const params = {
            inparam: ['in_user', 'in_ipaddr'],
            invalue: [USER_ID, serverIP],
            inproc: 'public.f_exchange_rate_get_currency',
        };

        const cursorData = await executFunction(params.inproc, params.inparam, params.invalue);

        return cursorData;
    } catch (ex) {
        throw ex;
    }
};

/**
 * @Function
 * Summary : 조회된 일일 환율 DB 등록 함수.
 */
const registerExchangeRateOnDB = async (rateData) => {
    try {
        const params = {
            inparam: ['in_ratedata', 'in_user', 'in_ipaddr'],
            invalue: [JSON.stringify(rateData), USER_ID, serverIP],
            inproc: 'public.f_exchange_rate_set_data',
        };

        const cursorData = await executFunction(params.inproc, params.inparam, params.invalue);

        return cursorData;
    } catch (ex) {
        throw ex;
    }
};

/**
 * @Function
 * Summary : USFP 등록이 완료된 통화 if_yn 'Y' 처리
 */
const setExchangeRateIFData = async (currenyList) => {
    try {
        const params = {
            inparam: ['in_rate_list', 'in_user', 'in_ipaddr'],
            invalue: [currenyList, USER_ID, serverIP],
            inproc: 'public.f_exchange_rate_set_if_data',
        };

        const cursorData = await executFunction(params.inproc, params.inparam, params.invalue);

        return cursorData;
    } catch (ex) {
        throw ex;
    }
};

/**
 * @Function
 * Summary : 메일 발송 배치 등록 함수.
 */
const sendExchangeRateResultMail = async (mailOption) => {
    try {
        const inparam = ['in_subject', 'in_content', 'in_pgm_code', 'in_attachment', 'in_user', 'in_ipaddr'];
        const invalue = [mailOption.subject, mailOption.content, mailOption.pgm_code, mailOption.attachment, USER_ID, serverIP];
        const inproc = 'public.f_exchange_rate_ins_send_email';

        const cursorData = await executFunction(inproc, inparam, invalue);

        return cursorData;
    } catch (ex) {
        throw ex;
    }
};

module.exports = {
    getScriptAPI,
    getHolidayDate,
    getCurrencyInfo,
    registerExchangeRateOnDB,
    setExchangeRateIFData,
    sendExchangeRateResultMail
}