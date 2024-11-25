const { workerData } = require('worker_threads');
const path = require("node:path");

const cheerio = require("cheerio");
const ExcelJS = require("exceljs");

const { log, error } = require('@repo/kwe-lib/components/logHelper');
const { sleep } = require('@repo/kwe-lib/components/sleep.js');
const { getKoreaTime, checkUTCOneDay, DateToString, stringToDateString, convertCurrentTimeToUFSPFormat } = require('@repo/kwe-lib/components/dataFormatter.js');

const { config, common } = require('../../helpers');

const { util, template } = require("./resources");
const { repository, external } = require("./resources/integrations");
const { constant } = require("./resources/types");

const Teams = require("../../notification/teams");
const Library = require('../../ufspLibrary/ufsLibray');

const ufsp = new Library(workerData);

const excuteState = {
    onExcute: false
};

const startInsertExchangeRateData = async () => {
    const enterTime = getKoreaTime();
    const enterTimeHours = enterTime.getUTCHours();
    const enterTimeMinutes = enterTime.getUTCMinutes();

    if (enterTimeHours >= 8
        && enterTimeMinutes >= 30 
        && checkUTCOneDay(enterTime, ufsp.lastExcute)
    ) {
        const teams = new Teams("EXCHANGE RATE BATCH");

        /**
         * @SECTION
         * Process : 1
         * Summary : 휴일 체크
         * [ Details ]
         * 실행 날짜가 토,일,공휴일일 경우 배치 실행 X.
         */
        const process1 = "공휴일 체크"

        const weekOfDay = enterTime.getUTCDay();
        if (weekOfDay === 6 || weekOfDay === 7) {
            ufsp.lastExcute = getKoreaTime();
            return;
        }

        const todayDateArray = [DateToString(), DateToString(new Date(),'-')];

        const holidayList = await repository.getHolidayDate(todayDateArray[0])
            .catch(ex => {
                // TEAMS
                teams.sendMessage(process1, ex);
                return;
            });

        if (todayDateArray[0] === holidayList[0].solar_dd) {
            ufsp.lastExcute = getKoreaTime();
            return;
        }

        // TEAMS
        teams.addProcessResult(process1);

        /**
         * @SECTION
         * Process : 2
         * Summary : 적용, 마감기간 산정
         * [ Details ]
         * 1. 적용기간은 로직 실행 날짜 하루 뒤.
         * 2. 마감기간은 공휴일 마지막 날짜 다음날.
         */
        const process2 = "적용기간 산정";

        const startApplyTime = util.addOneDay(todayDateArray[0]);
        let endApplyTime = util.checkLastHoliday(startApplyTime, holidayList);

        // TEAMS
        teams.addProcessResult(process2, startApplyTime + "~" + endApplyTime);

        /**
         * @SECTION
         * Process : 3
         * Summary : 통화 정보 DB 조회
         */
        const process3 = "통화 정보 DB 조회";

        const currencyInfo = await repository.getCurrencyInfo(todayDateArray[0])
            .catch(ex => {
                // TEAMS
                teams.sendMessage(process3, ex);
                return;
            });

        const shinhanCurrencyInfo = currencyInfo[0].data;
        const hanaCurrencyInfo = currencyInfo[1].data;

        // TEAMS
        teams.addProcessResult(process3);

        /**
         * @SECTION
         * Process : 4
         * Summary : 신한은행 환율조회 API 호출
         */
        const process4 = "신한은행 환율조회 API 호출";

        const shinhanResponse = await external.getShinhanExchangeRate(todayDateArray[0])
            .catch(ex => {
                // TEAMS
                teams.sendMessage(process4, ex);
                return;
            });

        const noticeRateInfo = {
            executDate: `${shinhanResponse.dataBody["고시일자_display"]} ${shinhanResponse.dataBody["고시시간_display"]} ( ${shinhanResponse.dataBody["고시회차"]}회차 )`,
            baseDate: stringToDateString(shinhanResponse.dataBody["고시일자"], "-"),
            effectiveDate: `${stringToDateString(startApplyTime, "-")} ~ ${stringToDateString(endApplyTime, "-")}`
        }

        const currencyRateMap = new Map();
        const currencyArray = [];
        const alterCurrencyRecord = {};
        const divideMap = new Map();
        
        /**
         * @dev
         * 환율 정보 case 별 분류.
         */
        for (let info of shinhanCurrencyInfo) {
            currencyArray.push(info.currency);

            if (info.alter_currency !== null) {
                if (!alterCurrencyRecord[info.alter_currency]) {
                    alterCurrencyRecord[info.alter_currency] = [];
                }
                alterCurrencyRecord[info.alter_currency].push(info.currency);
            }

            if (info.divide !== null) {
                divideMap.set(info.currency, info.divide);
            }
        }

        // TEAMS
        teams.addProcessResult(process4);

        /**
         * @SECTION
         * Process : 5
         * Summary : 조회된 신한은행 환율 정보 Map 설정
         * [ Details ]
         * 1. SHINHAN_EUR_CURRENCY_LIST의 경우 일반적으로 EUR과 값이 동일함.
         * 2. 단, ESP와 ITL은 100씩 나누어줌.
         * 3. JPY와 IDR도 100씩 나누어 준다.
         */
        const process5 = "신한은행 환율 정보 Map 설정";

        const shinhanCurrenyRateList =  shinhanResponse.dataBody.R_RIBF3730_1;
        for (let currency of shinhanCurrenyRateList) {

            let code = currency["통화CODE"];
            let rate = currency["전신환매도환율_display"];

            if (currencyArray.includes(code)) {
                if (code in alterCurrencyRecord) {
                    for (let alterCurrency of alterCurrencyRecord[code]) {
                        if (divideMap.has(alterCurrency)) {
                            currencyRateMap.set(alterCurrency, util.divideStringValue(rate, Number(divideMap.get(alterCurrency))));
                        } else {
                            currencyRateMap.set(alterCurrency, rate.replaceAll(",", ""));
                        }
                    }
                }
                
                if (divideMap.has(code)) {
                    currencyRateMap.set(code, util.divideStringValue(rate, Number(divideMap.get(code))));
                } else {
                    currencyRateMap.set(code, rate.replaceAll(",", ""));
                }
            }
        }

        // TEAMS
        teams.addProcessResult(process5);

        /**
         * @SECTION
         * Process : 6
         * Summary : 하나은행 환율조회 JSP 호출
         */
        const process6 = "하나은행 환율 JSP 호출";

        const hanaResponse = await external.getHanaExchangeRate(todayDateArray[1], todayDateArray[0])
            .catch(ex => {
                // TEAMS
                teams.sendMessage(process6, ex, false);
                return;
            });

        // TEAMS
        teams.addProcessResult(process6);

        /**
         * @SECTION
         * Process : 7
         * Summary : 조회된 하나은행 환율 정보 Map 설정
         * [ Details ]
         * 1. CZK, INR만 활용
         */
        const process7 = "하나은행 환율 정보 Map 설정";

        if (!hanaResponse) {
            teams.sendMessage(process7, "하나은행 환율 정보 조회 실패", false);
            return;
        }

        const $ = cheerio.load(hanaResponse);

        for (let info of hanaCurrencyInfo) {
            const element = $('tbody tr').filter((_, element) => {
                const targetElement = $(element).find("td.tc a u").text().trim();
                return targetElement.includes(info.currency);
            });

            currencyRateMap.set(info.currency, element.find('td.txtAr').eq(info.idx).text().trim().replaceAll(",", ""));
        }

        noticeRateInfo.total = currencyRateMap.size;

        const insertRateData = {
            fr_dd: startApplyTime,
            to_dd: endApplyTime,
            round: shinhanResponse.dataBody["고시회차"] + "회차",
            rate_map: Object.fromEntries(currencyRateMap)
        };

        // TEAMS
        teams.addProcessResult(process7);

        /**
         * @SECTION
         * Process : 8
         * Summary : 환율 데이터 DB insert
         */
        const process8 = "환율 데이터 DB insert";

        const registerExchangeRateOnDBResult = await repository.registerExchangeRateOnDB(insertRateData)
            .catch(ex => {
                // TEAMS
                teams.sendMessage(process8, ex);
                return;
            });

        if (registerExchangeRateOnDBResult.length !== 0) {
            /**
             * @dev
             * 일일 중복 DB 등록 시 완료 처리 해야함.
             */
            teams.sendMessage(process8, "일일 환율 등록 중복", false);
            return;
        } else {
            // TEAMS
            teams.addProcessResult(process8, JSON.stringify(Object.fromEntries(currencyRateMap)));
        }
 
        /**
         * @SECTION
         * Process : 9
         * Summary : USFP 환율 등록
         */
        const process9 = "USFP 환율 등록";

        const notInsertMap = new Map();
        const duplicateMap = new Map();
        const finishedInsertMap = new Map();

        insertRateData.rate_map = currencyRateMap;

        const callUFSP = async () => {
            for (const rate of insertRateData.rate_map) {
                ufsp.resultData = {};

                const row = util.setUSFPRow(insertRateData, rate);
                await ufsp.addJsonResult('exchange_rate_data', '', '', row, 'addBulk');
                await ufsp.addJsonResult('data_insert_time', '', '', convertCurrentTimeToUFSPFormat(),'addBulk');

                let script = await ufsp.getScript();

                await ufsp.loginByApi('dongyoon.yoo', false)
                    .catch(async ex => {
                        // TEAMS
                        teams.sendMessage(process9, ex, false);
                        await ufsp.close();
                        return;
                    });

                try {
                    await ufsp.startScript(script)
                        .catch(async ex => {
                            // TEAMS
                            teams.sendMessage(process9, ex, false);
                            await ufsp.close();
                            return;
                        });

                    const result = await ufsp.resultData.exchange_rate_insert_result[0];

                    if (Array.isArray(result) && result.length === 0) {
                        finishedInsertMap.set(rate[0], rate[1]);
                    } else if (typeof result === "object" && !Array.isArray(result) && result.sev === 3 && result.message === null) {
                        notInsertMap.set(rate[0], rate[1]);
                    } else { 
                        duplicateMap.set(rate[0], rate[1]);
                    }
                } catch (ex) {
                    // TEAMS
                    teams.sendMessage(process9, ex, false);
                    await ufsp.close();
                    return; 
                }

                await sleep(5000);
            }
        };

        await callUFSP();

        if (duplicateMap.size !== 0) {
            // TEAMS
            teams.addProcessResult("ufsp 중복 등록 환율 발생", JSON.stringify(Object.fromEntries(duplicateMap)), false);
        }

        if (notInsertMap.size !== 0) {
            // TEAMS
            teams.addProcessResult("ufsp 미등록 환율 발생", JSON.stringify(Object.fromEntries(notInsertMap)), false);

            insertRateData.rate_map = notInsertMap;
            await callUFSP();
        }

        // TEAMS
        teams.addProcessResult(process9);

        /**
         * @SECTION
         * Process : 10
         * Summary : 완료된 데이터 db if_yn = 'Y'.
         */
        const process10 = "UFSP 등록 완료 데이터 db if_yn = 'Y";
        
        const finishedInsertMapArray = Array.from(finishedInsertMap.keys()).join(" ");
        await repository.setExchangeRateIFData(finishedInsertMapArray)
            .catch(ex => {
                // TEAMS
                teams.sendMessage(process10, ex, false);
                return;
            });

        // TEAMS
        teams.addProcessResult(process10);

        /**
         * @SECTION
         * Process : 11
         * Summary : 환율 데이터 excel file 제작 및 업로드.
         */
        const process11 = "환율 데이터 excel file 제작 및 업로드";

        const workBook = new ExcelJS.Workbook();

        const resultBuffer = await template.makeCurrencyRateExcelTemplate(workBook, currencyRateMap, noticeRateInfo)
            .catch(ex => {
                // TEAMS
                teams.sendMessage(process11, ex, false);
                return;
            });
        
        // TEAMS
        teams.addProcessResult(process11);

        /**
         * @SECTION
         * Process : 12
         * Summary : 환율 데이터 파일 업로드 및 메일 발송.
         */
        const process12 = "환율 데이터 파일 업로드 및 메일 발송";

        const uploadFileDirectory = path.join(process.env.DIRECTORY_MAIL_ATTACH, constant.EXCHANGE_FILE_PATH);
        const uploadFilePath = path.join(uploadFileDirectory, todayDateArray[0].concat(constant.EXCHANGE_FILE_EXTENSION));

        const fileUploadResult = common.checkDirectory(uploadFileDirectory, uploadFilePath, resultBuffer);
        if (fileUploadResult === "") {
            // TEAMS
            teams.sendMessage(process12, "파일 업로드에 실패하였습니다.", false);
            return;
        }

        const mailOption = {
            subject : `UFS ${todayDateArray[1]} 환율 입력 결과`,
            content : "금일 UFS PR에 입력된 환율 결과 입니다.",
            pgm_code: "EXCHANGE_RATE_RESULT",
            attachment: fileUploadResult
        };

        const sendMailResult = await repository.sendExchangeRateResultMail(mailOption)
            .catch(ex => {
                // TEAMS
                teams.sendMessage(process12, ex, false);
                return;
            });

        // TEAMS
        teams.sendMessage(process12);

        return;
    } else {
        /**
         * @dev
         * 시간 조건 안맞을 시 바로 return
         */
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
    const proxyFn = config.registerProxyFunction(startInsertExchangeRateData, excuteState);
    proxyFn();
    config.setBatchInterval(proxyFn, 10000);

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