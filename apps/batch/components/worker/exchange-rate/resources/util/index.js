const Decimal = require("decimal.js");

const { stringToShortMonthDate } = require("@repo/kwe-lib/components/dataFormatter");

const addOneDay = (yyyymmdd) => {
    const year = parseInt(yyyymmdd.slice(0, 4), 10);
    const month = parseInt(yyyymmdd.slice(4, 6), 10) - 1;
    const day = parseInt(yyyymmdd.slice(6, 8), 10);
  
    const date = new Date(year, month, day);
    date.setDate(date.getDate() + 1);
  
    return getStringFormatDate(date, "");
};

const subOneDay = (yyyymmdd) => {
  const year = parseInt(yyyymmdd.slice(0,4), 10);
  const month = parseInt(yyyymmdd.slice(4,6), 10) - 1;
  const day = parseInt(yyyymmdd.slice(6,8), 10);

  const date = new Date(year, month, day);
  date.setDate(date.getDate() - 1);
  
  return getStringFormatDate(date, "");
}

const checkLastHoliday = (yyyymmdd, holidayList) => {
    for (let holiday of holidayList) {
        if (yyyymmdd === holiday.solar_dd) {
            return checkLastHoliday(addOneDay(yyyymmdd), holidayList);
        }
    }
    return yyyymmdd;
};

const getStringFormatDate = (date, type) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (type === "-")
        return `${year}-${month}-${day}`;

    return `${year}${month}${day}`;
};

const divideStringValue = (value, amount) => {
    const floatValue = parseFloat(value.replaceAll(",", ""));
    /**
     * @dev
     * 부동 소수점 이슈로 인한 오차범위 방지로 인한 decimal.js 사용.
     */
    let divideValue = (new Decimal(floatValue).div(amount)).toString();9

    return divideValue;
};

const setUSFPRow = (rateData, rate) => {
    const row = Array(21).fill("");
    row[1] = "KRW";
    row[2] = stringToShortMonthDate(rateData.fr_dd);
    row[3] = stringToShortMonthDate(rateData.to_dd);
    row[4] = rate[1];
    row[7] = "550";
    row[10] = "ALL";
    row[11] = "BNK";
    row[17] = rate[0];
    row[18] = "ALL";

    return row;
}

module.exports = {
    addOneDay,
    subOneDay,
    checkLastHoliday,
    divideStringValue,
    setUSFPRow
}