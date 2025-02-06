const { convertCurrentTimeToSFSPFormatSecond, convertCurrentTimeToUFSPFormat } = require("@repo/kwe-lib/components/dataFormatter");

const setInsertMilestoneRow = (milestoneInfo, usfpId, pipelineTX) => {
    const data = JSON.parse(JSON.stringify(milestoneInfo));

    const row = Array(30).fill("");
    row[1] = data.milestone;
    row[3] = data.transport;
    row[4] = pipelineTX;
    row[12] = data.remark;
    row[13] = convertCurrentTimeToUFSPFormat(data.local_dd).concat(":00");
    row[15] = convertCurrentTimeToSFSPFormatSecond();
    row[16] = usfpId;
    row[21] = data.location;
    row[25] = 'KR1';
    row[26] = 'KR1';
    row[29] = data.port;

    return row;
};

module.exports = {
    setInsertMilestoneRow
}