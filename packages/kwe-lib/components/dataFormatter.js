const { log } = require('./logHelper');

function textToDate(text) {
    var yyyy = text.slice(0,4);
    var mm = text.slice(4,2);
    var dd = text.slice(6,2);
    var hh = text.slice(8,2);
    var mi = text.slice(10,2);
    var ss = text.slice(12,2);

    var newDate = new Date(yyyy, mm, dd, hh, mi, ss, 0);

    return newDate;    
}

function stringToDateString(source, delimiter = '') {
    if (source) {
        const formattedDate = source.replace(/[\/\-\s]/g, '');
        const year = formattedDate.substring(0,4);
        const month = formattedDate.substring(4,6);
        const day = formattedDate.substring(6,8);

        return [year, month, day].join(delimiter);
    }
};

function DateToString(source, delimiter = '') {
    if (source) {
        const year = source.getFullYear();
        const month = (source.getMonth() + 1).toString().padStart(2,0);
        const day = (source.getDate()).toString().padStart(2,0);

        return [year, month, day].join(delimiter);
    };
};

function stringToFullDateString(source, delimiter = '-') {
    if (source) {
        const year = source.substring(0,4);
        const month = source.substring(4,6);
        const day = source.substring(6,8);
        const hour = source.substring(8,10);
        const min = source.substring(10,12);
        const second = source.substring(12,14);

        return [year, month, day].join(delimiter) + " " + (hour ? [hour, min, second].join(":") : "");
    };
};

function stringToFullDate(source) {
    if (source) {
        const year = source.substring(0,4);
        const month = source.substring(4,6);
        const day = source.substring(6,8);
        const hour = source.substring(8,10);
        const min = source.substring(10,12);
        const second = source.substring(12,14);

        return new Date([year, month, day].join("") + " " + [hour, min, second].join(":"));
    }
};

function stringToDate(source) {
    log("stringToDate", source);
    if (source) {
        const formattedDate = source.replace(/[\/\-\s]/g, '');
        const year = formattedDate.substring(0,4);
        const month = formattedDate.substring(4,6);
        const day = formattedDate.substring(6,8);
        log("dataFormatter", year, month, day);
        try {
            return new Date([year, month, day].join("-"));
        } catch (e) {
            return null;
        }
    }
};

function getKoreaTime() {
    // const now = new Date();
    // const koreaTime = now.toLocaleString("ko-KR", {
    //     timeZone: "Asia/Seoul",
    // });
    // const formattedKoreaTime = koreaTime.replace(/\./g, "-").replace("오후 ", "");
    // log("koreaTime", koreaTime, formattedKoreaTime, new Date(formattedKoreaTime));
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
    const koreaTimeDiff = 9 * 60 * 60 * 1000;
    const korNow = new Date(utc+koreaTimeDiff);

    // 년, 월, 일 정보 얻기
    // const year = korNow.getFullYear();
    // const month = korNow.getMonth() + 1;
    // const day = korNow.getDate();

    // // 시, 분, 초 정보 얻기
    // const hours = korNow.getHours();
    // const minutes = korNow.getMinutes();
    // const seconds = korNow.getSeconds();

    // // 현재 날짜와 시간 출력
    // log(`현재 날짜: ${year}-${month}-${day}`);
    // log(`현재 시간: ${hours}:${minutes}:${seconds}`);

    // return new Date(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    return korNow;
};



module.exports = {
    textToDate,
    stringToDateString,
    DateToString,
    stringToFullDateString,
    stringToFullDate,
    stringToDate,
    getKoreaTime
  }