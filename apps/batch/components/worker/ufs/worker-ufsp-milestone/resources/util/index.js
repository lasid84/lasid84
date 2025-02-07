const { convertCurrentTimeToSFSPFormatSecond } = require("@repo/kwe-lib/components/dataFormatter");

const setInsertMilestoneRow = (milestoneInfo, usfpId, pipelineTX) => {
    const data = JSON.parse(JSON.stringify(milestoneInfo));

    const row = Array(30).fill("");
    row[1] = data.milestone;
    row[3] = data.transport;
    row[4] = pipelineTX;
    row[12] = data.remark;
    row[13] = convertDate(data.local_dd);
    row[15] = convertCurrentTimeToSFSPFormatSecond();
    row[16] = usfpId;
    row[21] = data.location;
    row[25] = 'KR1';
    row[26] = 'KR1';
    row[29] = data.port;

    return row;
};

const convertDate = (localdd) => {
    const year = parseInt(localdd.slice(0, 4), 10); 
    const month = parseInt(localdd.slice(4,6), 10)-1;
    const day = parseInt(localdd.slice(6,8), 10);
    
    const hour = parseInt(localdd.slice(8,10), 10);
    const minute = parseInt(localdd.slice(10,12), 10);
    const second = parseInt(localdd.slice(12,14), 10);

    const date = new Date(year, month, day, hour, minute, second);
    const monthShort = date.toLocaleString("en-US", { month: "short" });

    const newDay = date.getDate().toString().padStart(2, "0");
    const newYear = date.getFullYear();
    const newHours = date.getHours().toString().padStart(2, "0");
    const newMinutes = date.getMinutes().toString().padStart(2, "0");
    const newSecond = date.getSeconds().toString().padStart(2, "0");
  
    return `${newDay}-${monthShort}-${newYear} ${newHours}:${newMinutes}:${newSecond}`;
}

module.exports = {
    setInsertMilestoneRow
}