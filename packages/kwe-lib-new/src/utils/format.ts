
export const stringToDateString = (source: string, delimiter = '') => {
    if (source) {
        const formattedDate = source.replace(/[\/\-\s]/g, '');
        const year = formattedDate.substring(0,4);
        const month = formattedDate.substring(4,6);
        const day = formattedDate.substring(6,8);

        return [year, month, day].join(delimiter);
    }

    return '';
};

/**
 * @dev
 * Return the date string in the format of 'YYYYMMDD' with delimiter (YYYY + delimiter + MM + delimiter + DD).
 */
export const DateToString = (source = new Date(), delimiter = '') => {
    if (source) {
        const year = source.getFullYear();
        const month = (source.getMonth() + 1).toString().padStart(2,'0');
        const day = (source.getDate()).toString().padStart(2,'0');

        return [year, month, day].join(delimiter);
    };
};

/**
 * @dev
 * Return the date string in the format of 'YYYYMMDD HHMMSS' with delimiter
 */
export const DateToFullString = (source = new Date(), delimiter = '') => {
    if (source) {
        const year = source.getFullYear();
        const month = (source.getMonth() + 1).toString().padStart(2,'0');
        const day = (source.getDate()).toString().padStart(2,'0');
        const hours = source.getHours().toString().padStart(2, '0');
        const minutes = source.getMinutes().toString().padStart(2, '0');
        const seconds = source.getSeconds().toString().padStart(2, '0');

        return [year, month, day].join(delimiter) + ' ' + [hours, minutes, seconds].join(':');
    };
};

/**
 * @dev
 * Return the date string in the format of 'YYYYMMDD HH:MM:SS' with delimiter
 */
export const stringToFullDateString = (source: string, delimiter = '-') => {
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

/**
 * @dev
 * Return the date in the format of 'YYYYMMDD HH:MM:SS' with delimiter
 */
export const stringToFullDate = (source: string) => {
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

/**
 * @dev
 * Return the date in the format of 'YYYYMMDD' with delimiter
 */
export const stringToDate = (source: string, delimiter = '-') => {
    
    if (source) {
        const formattedDate = source.replace(/[\/\-\s]/g, '');
        const year = formattedDate.substring(0,4);
        const month = formattedDate.substring(4,6);
        const day = formattedDate.substring(6,8);
        try {
            return new Date([year, month, day].join(delimiter));
        } catch (e) {
            return null;
        }
    }
};

/**
 * @dev
 * Return the time in the format of 'HHMMSS' with delimiter
 */
export const stringToTime = (source: string, delimiter = ':') => {
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

/**
 * @dev
 * Return the korea time
 */
export const getKoreaTime = (date = new Date()) => {
    const currentUTC = date;

    // 한국의 UTC 오프셋은 +9시간이므로 이를 더하여 한국 시간으로 변환합니다.
    const offset = 9; // 한국의 UTC 오프셋은 +9시간
    const korNow = new Date(currentUTC.getTime() + (offset * 60 * 60 * 1000));

    return korNow;

};

export const addDaysToDate  = (dateString: string, days: number) => {
    dateString = dateString.replace(/[\/\-\s]/g, '');

    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // 0-indexed month
    const day = parseInt(dateString.substring(6, 8), 10);

    // Date 객체 생성
    const date = new Date(year, month, day);

    // days를 더한 날짜로 설정
    date.setDate(date.getDate() + days);

    // 새로운 날짜를 YYYYMMDD 형식의 문자열로 반환
    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0'); // month는 0부터 시작하므로 +1
    const newDay = String(date.getDate()).padStart(2, '0');

    return `${newYear}${newMonth}${newDay}`;
};

/**
 * @dev
 * Return the date string in the format of '08-Jan-2023 00:00:00'
 */
export const stringToShortMonthDate = (dateString: string) => {
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10) - 1;
    const day = parseInt(dateString.slice(6, 8), 10);
  
    const date = new Date(year, month, day);
  
    const monthShort = date.toLocaleString("en-US", { month: "short" });
  
    return `${day.toString().padStart(2, "0")}-${monthShort}-${year} 00:00:00`;
}

/**
 * @dev
 * Return 
 */
export const convertCurrentTimeToUFSPFormat = () => {
    const date = new Date();

    const day = date.getDate().toString().padStart(2, "0");
    const monthShort = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
  
    return `${day}-${monthShort}-${year} ${hours}:${minutes}`;
};

/**
 * @dev
 * Return 
 */
export const checkUTCOneDay = (standardDate: Date, targetDate: Date) => {
    if (!targetDate) {
        return true;
    }
    /**
     * @dev
     * getKoreaTime()에서 9시간을 미리 당겼기 때문에
     * 로컬 시간 기준(9시간+)으로 조회하는 getFullYear가 아닌
     * getUTCFullYear 사용.
     */
    const stdYear = standardDate.getUTCFullYear();
    const stdMonth = standardDate.getUTCMonth();
    const stdDay = standardDate.getUTCDate();

    const tgtYear = targetDate.getUTCFullYear();
    const tgtMonth = targetDate.getUTCMonth();
    const tgtDay = targetDate.getUTCDate();

    const oneDay = new Date(tgtYear, tgtMonth, tgtDay + 1);

    return (
        oneDay.getFullYear() === stdYear
        &&
        oneDay.getMonth() === stdMonth
        &&
        oneDay.getDate() === stdDay
    )
}