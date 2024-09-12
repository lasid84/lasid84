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
        source = source.replace(/[-\/]/g, '');
        const year = source.substring(0,4);
        const month = source.substring(4,6);
        const day = source.substring(6,8);
        const hour = source.substring(8,10);
        const min = source.substring(10,12);
        const second = source.substring(12,14);

        return [year, month, day].join(delimiter) + " " + (hour ? [hour, min, second].filter(v => v).join(":") : "");
    };
};

function stringToFullDate(source) {
    if (source) {
        source = source.replace(/[-\/]/g, '');
        const year = source.substring(0,4);
        const month = source.substring(4,6);
        const day = source.substring(6,8);
        const hour = source.substring(8,10);
        const min = source.substring(10,12);
        const second = source.substring(12,14);

        return new Date([year, month, day].join("") + " " + [hour, min, second].join(":"));
    }
};

function stringToDate(source, separator = '-') {
    // log("stringToDate", source);
    if (source) {
        const formattedDate = source.replace(/[\/\-\s]/g, '');
        const year = formattedDate.substring(0,4);
        const month = formattedDate.substring(4,6);
        const day = formattedDate.substring(6,8);
        // log("dataFormatter", year, month, day);
        try {
            return new Date([year, month, day].join(separator));
            // return new Date(year, month - 1, day);
        } catch (e) {
            return null;
        }
    }
};

function stringToTime(source, delimiter = ':') {
    if (source) {
        const formattedDate = source.replace(/[\:\s]/g, '').toString();
        const hour = formattedDate.slice(0,2);
        const min = formattedDate.slice(2,4);
        const sec = formattedDate.slice(4,6);
        try {
            return hour + delimiter + min + (sec ? delimiter + sec : "");
        } catch (e) {
            return null;
        }
    }
};

function getKoreaTime(date = new Date()) {
    // const now = new Date();
    // const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
    // const koreaTimeDiff = 9 * 60 * 60 * 1000;
    // const korNow = new Date(utc+koreaTimeDiff);

    // return korNow;

    // 현재 시간을 UTC로 가져옵니다.
    const currentUTC = date;

    // 한국의 UTC 오프셋은 +9시간이므로 이를 더하여 한국 시간으로 변환합니다.
    const offset = 9; // 한국의 UTC 오프셋은 +9시간
    const korNow = new Date(currentUTC.getTime() + (offset * 60 * 60 * 1000));

    return korNow;

};



module.exports = {
    textToDate,
    stringToDateString,
    DateToString,
    stringToFullDateString,
    stringToFullDate,
    stringToDate,
    getKoreaTime,
    stringToTime
  }