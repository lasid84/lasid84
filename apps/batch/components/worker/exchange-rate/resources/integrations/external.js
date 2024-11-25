const { getScriptAPI } = require("./repository");
const { EXCHANGE_RATE_SHINHAN_PGM, EXCHANGE_RATE_HANA_PGM, FETCH_API_JSON } = require("../types/constant");

/**
 * @Function
 * Summary : 신한은행 환율 조회 API 발송 함수.
 */
const getShinhanExchangeRate = async (executDate) => {
    try {
        const _apiInfo = await getScriptAPI(EXCHANGE_RATE_SHINHAN_PGM);
        const apiInfo = _apiInfo[0];

        const request = addJSONData(apiInfo, executDate);

        return fetchAPI(apiInfo, request, FETCH_API_JSON);
    } catch (ex) {
        throw ex;
    }
};

/**
 * @Function
 * Summary : 하나은행 환율 조회 API 발송 함수.
 */
const getHanaExchangeRate = async (todayDateString, todayDate) => {
    try {
        const _apiInfo = await getScriptAPI(EXCHANGE_RATE_HANA_PGM);
        const apiInfo = _apiInfo[0];

        apiInfo.url = apiInfo.url + apiInfo.body + apiInfo.upd_body_col.replace("${todayDateString}", todayDateString).replace("${todayDate}", todayDate);

        return fetchAPI(apiInfo);
    } catch (ex) {
        throw ex;
    }
};

/**
 * @Function
 * Summary : API Fetch 함수.
 */
const fetchAPI = async (apiInfo, request, type) => {
    try {
        let response;

        if (request) {
            response = await fetch(apiInfo.url, { method: apiInfo.method, body: JSON.stringify(request) } );
        } else {
            response = await fetch(apiInfo.url, { method: apiInfo.method } );
        }

        const returnValue = await response.text();

        if (type === FETCH_API_JSON) {
            return JSON.parse(returnValue);
        }

        return returnValue;
    } catch (ex) {
        throw ex;
    }
}

/**
 * @Function
 * Summary : request JSON data 추가 함수.
 */
const addJSONData = (data, value) => {
    try {
        const jsonData = JSON.parse(data.body);

        jsonData[data.upd_body_col][data.upd_body_val] = value;

        return jsonData;
    } catch (ex) {
        throw ex;
    }
}

module.exports = {
    getShinhanExchangeRate,
    getHanaExchangeRate
} 