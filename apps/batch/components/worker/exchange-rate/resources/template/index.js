const constant = require("../types/constant");

/**
 * @Function
 * Summary : 환율 조회 attachedment excel file 템플릿 제작 및 값 할당.
 */
const makeCurrencyRateExcelTemplate = async (workBook, rateMap, info) => {
    const workSheet = workBook.addWorksheet("exchange rate");

    /**
     * @dev
     * Excel 템플릿 세팅.
     * - Cell 별 style 추가 로직.
     */
    workSheet.columns = constant.WORKSHEET_WIDTHS;

    for (const [idx, height] of Array.from(constant.WORKSHEET_HEIGHTS.entries())) {
        const row = workSheet.getRow(idx+1);
        row.height = height;
    }

    let i=0;
    for (let cell of constant.WORKSHEET_FIX_MERGE_CELLS) {
        workSheet.mergeCells(cell);
        const _validCell = cell.split(":")[0];
        const validCell = workSheet.getCell(_validCell);
        validCell.border = constant.WORKSHEET_CELL_BORDER;
        validCell.alignment = constant.WORKSHEET_CELL_ALIGNMENT;
        validCell.value = (constant.WORKSHEET_CELL_VALUE[i].includes("@"))? info[constant.WORKSHEET_CELL_VALUE[i].split("@")[1]] : constant.WORKSHEET_CELL_VALUE[i];
        i++;

        /**
         * @dev
         * font 개별 지정
         */
        if (_validCell === "A1") {
            validCell.font = constant.WORKSHEET_CELL_FONT[0];
        } else if (["A6", "E6", "G6", "J6"].includes(_validCell)) {
            validCell.font = constant.WORKSHEET_CELL_FONT[3];
        } else {
            validCell.font = constant.WORKSHEET_CELL_FONT[2];
        }
    }

    /**
     * @dev
     * API로 가져온 환율 값 세팅.
     * [ Details ]
     * 1. 가져온 환율 데이터의 개수를 세어 Map에 저장된 순서대로 양쪽으로 배열하기 위함.
     * 2. 데이터 개수의 짝,홀 판단 및 판단에 따른 값 위치 설정.
     */
    const mapEntries = Array.from(rateMap.entries());
    const halfIndex = Math.floor(rateMap.size / 2);
    const halfRemain = (rateMap.size % 2 === 1)? true : false;
    for (let i=0; i<=halfIndex-1; i++) {
        const row = workSheet.getRow(i+7);
        row.height = 25;

        workSheet.mergeCells(`A${i+7}:D${i+7}`);
        workSheet.mergeCells(`E${i+7}:F${i+7}`);
        
        if (!halfRemain || i !== (halfIndex-1)) {
            workSheet.mergeCells(`G${i+7}:I${i+7}`);
            workSheet.mergeCells(`J${i+7}:K${i+7}`);
        }

        const keyCell1 = workSheet.getCell(`A${i+7}`);
        const keyCell2 = workSheet.getCell(`G${i+7}`);

        const valueCell1 = workSheet.getCell(`E${i+7}`);
        const valueCell2 = workSheet.getCell(`J${i+7}`);

        keyCell1.value = mapEntries[i][0];
        valueCell1.value = mapEntries[i][1];

        if (halfRemain) {
            if (i === (halfIndex-1)) {
                keyCell1.value = mapEntries[halfIndex][0];
                valueCell1.value = mapEntries[halfIndex][1];
            } else {
                keyCell2.value = mapEntries[(halfIndex + i) + 1][0];
                valueCell2.value = mapEntries[(halfIndex + i) + 1][1];
            }
        } else {
            keyCell2.value = mapEntries[(halfIndex + i)][0];
            valueCell2.value = mapEntries[(halfIndex + i)][1];
        }

        /**
         * @dev
         * Cell Style 세팅
         */
        const cellStyleList = [keyCell1, valueCell1, keyCell2, valueCell2];
        if (halfRemain && i === (halfIndex-1)) {
            cellStyleList.splice(2, 2);
        }
        for (let cell of cellStyleList) {
            cell.border = constant.WORKSHEET_CELL_BORDER;
            cell.alignment = constant.WORKSHEET_CELL_ALIGNMENT;
            cell.font = constant.WORKSHEET_CELL_FONT[1];
        }
    }

    return workBook.xlsx.writeBuffer();
};

module.exports = {
    makeCurrencyRateExcelTemplate
}