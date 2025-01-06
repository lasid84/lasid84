/**
 * @dev
 * get_script_api pgm code.
 */
const EXCHANGE_RATE_SHINHAN_PGM = "EXCHANGE_RATE_SHINHAN";
const EXCHANGE_RATE_HANA_PGM = "EXCHANGE_RATE_HANA";

const FETCH_API_JSON = "JSON";

/**
 * @dev
 * file_upload api constants
 */
const FILE_UPLOAD_URL = "/file/file-upload";
const FILE_TYPE_MAIL = "MAIL_ATTACH"

/**
 * @dev
 * 환율 정보 메일 발송용 엑셀 파일 업로드 경로.
 */
const EXCHANGE_FILE_PATH = "exchange-rate";
const EXCHANGE_FILE_EXTENSION = ".xlsx";

/**
 * @dev
 * 환율 조회 엑셀 템플릿 생성 관련 상수.
 */
const WORKSHEET_WIDTHS = [
    { width: 10.13 },
    { width: 2.63 },
    { width: 0.31 },
    { width: 6.88 },
    { width: 10.13 },
    { width: 10.63 },
    { width: 10.63 },
    { width: 3.13 },
    { width: 6.88 },
    { width: 10.13 },
    { width: 11.13 }
];
const WORKSHEET_HEIGHTS = [
    34.25, 8.75, 16.5, 16.5, 16.5,
    25
];
const WORKSHEET_FIX_MERGE_CELLS = [
    "A1:K1", "A3:C3", "D3:F3", "G3:H3", "I3:K3",
    "A4:C4", "D4:H4", "A5:C5", "D5:H5", "I4:I5",
    "J4:K5", "A6:D6", "E6:F6", "G6:I6", "J6:K6"
];
const WORKSHEET_CELL_BORDER = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
};
const WORKSHEET_CELL_FONT = [
    {
        name: "굴림",
        size: 16,
        bold: true,
    },
    {
        name: "굴림",
        size: 10
    },
    {
        name: "System",
        size: 9
    },
    {
        name: "신명조",
        size: 10,
        bold: true,
    }
];
const WORKSHEET_CELL_ALIGNMENT = {
    horizontal: "center",
    vertical: "middle"
};
const WORKSHEET_CELL_VALUE = [
    "환율조회(회차별)", "조회기간", "@executDate", "총건수", "@total",
    "기준일시", "@baseDate", "적용일시", "@effectiveDate", "확인자", 
    "                    (인)", "통화표시", "보내실 때", "통화표시", "보내실 때"
];


module.exports = {
    EXCHANGE_RATE_SHINHAN_PGM,
    EXCHANGE_RATE_HANA_PGM,

    FETCH_API_JSON,

    FILE_UPLOAD_URL,
    FILE_TYPE_MAIL,

    EXCHANGE_FILE_PATH,
    EXCHANGE_FILE_EXTENSION,

    WORKSHEET_WIDTHS,
    WORKSHEET_HEIGHTS,
    WORKSHEET_FIX_MERGE_CELLS,
    WORKSHEET_CELL_BORDER,
    WORKSHEET_CELL_FONT,
    WORKSHEET_CELL_ALIGNMENT,
    WORKSHEET_CELL_VALUE
}