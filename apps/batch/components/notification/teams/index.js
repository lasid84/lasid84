const { EXCHANGE_RATE_BATCH_CHANNEL_URL, batchReportTemplate, batchReportProcessObject } = require("./message_template");
const { getKoreaTime } = require('@repo/kwe-lib/components/dataFormatter.js');

class Teams {
    title = "";
    template = {};

    startTime = null;
    endTime = null;
    error = null;

    processResultIcon = ["✅", "❌"];
    batchResultIcon = ["☑️", "✖️"];
    
    constructor(title) {
        this.title = title;
        this.startTime = getKoreaTime();
        this.template = JSON.parse(JSON.stringify(batchReportTemplate));
        this.processArray = [];
        this.error = null;
        this.endTIme = null;
    }

    addProcessResult(name, info, status=true) {
        const processInfo = {
            excuteTime: getKoreaTime(),
            processName: name,
            status: status
        }

        if (info !== undefined) {
            processInfo.information = info;
        }

        this.processArray.push(processInfo);
    }

    sendMessage(name, error) {
        let status;

        if (error === undefined) {
            this.result = true;
            status = true;
        } else {
            this.result = false;
            this.error = error;
            status = false;
        }

        if (!status) {
            this.addProcessResult(name, error, status);
        } else {
            this.addProcessResult(name, undefined, status);
        }

        this.endTime = getKoreaTime();
        this.send();
    }

    async send() {
        const request = JSON.parse(JSON.stringify(this.template));

        const firstColumn = request.attachments[0].content.body[0].columns[0].items[0];

        firstColumn.rows[0].cells[0].items[0].text = this.title;
        firstColumn.rows[1].cells[0].items[1].items[0].text = this.startTime;
        firstColumn.rows[2].cells[0].items[0].items[1].text = this.endTime;
        firstColumn.rows[3].cells[0].items[1].items[0].text = (this.result === true)? this.batchResultIcon[0] : this.batchResultIcon[1];
        firstColumn.rows[4].cells[0].items[1].items[0].text = (this.error)? this.error : "없음";

        for (let process of this.processArray) {
            const object = JSON.parse(JSON.stringify(batchReportProcessObject));

            object.cells[0].items[0].text = process.excuteTime;
            object.cells[1].items[0].text = process.processName;
            object.cells[2].items[0].text = (process.status)? this.processResultIcon[0] : this.processResultIcon[1];
            object.cells[3].items[0].text = (process.information)? process.information : "none";

            request.attachments[0].content.body[0].columns[1].items[0].rows.push(object);
        }

        try {
            await fetch(EXCHANGE_RATE_BATCH_CHANNEL_URL, {
                method: 'POST',
                body: JSON.stringify(request)
            });
        } catch (ex) {
            console.log(ex);
        }
    }
}

module.exports = Teams;