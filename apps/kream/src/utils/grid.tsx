import { ValueGetterParams } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
// import { valueGetterMethods } from "./params";
// import moment from "moment";
// import { devConsoleLog } from "./dev";

const AgGridApi = (gridRef: any) => {
  if (!gridRef.current) {
    return null;
  }
  const agGridReact: AgGridReact = gridRef.current as AgGridReact;
  return agGridReact.api;
};

// 그리드 줄번호 표시
// const createRowIndexGetter = (page: number | undefined, size: number | undefined) => {
//   // 기본값
//   let _page = 1;
//   let _size = 10;

//   if (page) _page = page;
//   if (size) _size = size;
//   const initRowNo = (_page - 1) * _size + 1;

//   return (params: ValueGetterParams) => {
//     return params.node!.rowIndex! * 1 + initRowNo;
//   };
// };

// ====== 다국어 표시 처리 ======

// 사용여부 use_yn
// const createUseYnValueGetter = (t: any) => {
//   return (params: ValueGetterParams) => {
//     return valueGetterMethods(t, params, "use_yn");
//     // return params.node?.data.use_yn === "Y" ? t("lbl.use_yn.Y") : t("lbl.use_yn.N");
//   };
// };

// const timeFormatterYMDH = (dataType: string) => {
//   return (params: ValueGetterParams) => {
//     const inputData = params.node?.data;
//     if (!inputData) return;
//     let key, value;
//     for ([key, value] of Object.entries(inputData)) {
//       if (key === dataType) {
//         devConsoleLog("value ::", value);
//         return addTimeFormatter(value);
//       }
//     }
//   };
// };

// const addTimeFormatter = (value: any) => {
//   return value
//     ? moment(value.toString().substring(0, 16).replace("T", " "))
//         .add(9, "hours")
//         .format("YYYY-MM-DD HH:mm")
//     : "";
// };

//aggrid columnDefs에서 사용
//valueFormatter: thousandSeperatorFormatter
const thousandSeperatorFormatter = (params: any) => {
  //천단위 콤마 추가
  return params?.value
    ? params.value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
    : params.value;
};

const thousandSeperatorAddFormatter = (params: any) => {
  //천단위 콤마 추가
  return params?.value
    ? (params.value >= 0 ? "+ " : "") +
        params.value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
    : params.value;
};

const getEnableKey = () => {
  const enableKey =
    "Using_this_AG_Grid_Enterprise_key_( AG-043793 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( KWE Korea )_is_granted_a_( Single Application )_Developer_License_for_the_application_( Jung Keun Kim )_only_for_( 2 )_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_working_on_( Jung Keun Kim )_need_to_be_licensed___( Jung Keun Kim )_has_been_granted_a_Deployment_License_Add-on_for_( 1 )_Production_Environment___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 19 June 2024 )____[v2]_MTcxODc1MTYwMDAwMA==8a38faa309614f9bcb472bf27f2aa4ff";
  return enableKey;
};

const gridHeightScroll5Row = "h-[233px]";
const gridHeightNoScroll = "h-[333px]";
const gridHeightScroll = "h-[341px]";
const gridHeightPageScroll = "h-[381px]";
const gridHeightFullNoScroll = "h-[633px]";
const gridHeightFullScroll = "h-[641px]";
const gridHeightFullPageScroll = "h-[681px]";

const gridRowHeight = {
  rowHeight: 30,
  headerHeight: 30,
};

const gridUtilDefaultColDef = {
  headerClass: "text-center",
  suppressMenu: true, //메뉴 안보이게 true
  sortable: true, //정렬 사용 true
  filter: 'agTextColumnFilter', //필터 사용
  resizable: true, //사이즈 변경 가능하게
  suppressMovable: false, // 컬럼 이동 막기 false
};

const gridUtilRowClickSelection = {
  suppressRowClickSelection: true, // 행 클릭만으로 선택되지 않도록 : true, Clipboard에 영향 미침, cell만 복사
};

const gridUtilDragLeaveHideColumns = {
  suppressDragLeaveHidesColumns: true, //헤더 드래그로 사라지지 않게 설정
};

const gridUtilEnableFill = {
  enableFillHandle: true, // 범위 선택으로 자동 채우기 기능, enableRangeSelection와 같이 사용해야함
};

const gridUtilRangeSelection = {
  enableRangeSelection: true, // 마우스 드래그, ctrl 키를 이용하여 선택 가능, enableFillHandle와 같이 사용해야함
};

const gridUtilDefaultOptions = {
  ...gridUtilRowClickSelection,
  ...gridUtilDragLeaveHideColumns,
  ...gridUtilEnableFill,
  ...gridUtilRangeSelection,
};

const gridOverLayTemplate = {
  overlayNoRowsTemplate: `<span class="ag-overlay-loading-center">검색된 데이터가 없습니다.</span>`,
  overlayLoadingTemplate: `
    <div role="status">
        <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
    </div>
  `,
};

export {
  AgGridReact,
  AgGridApi,
//   createRowIndexGetter,
//   createUseYnValueGetter,
  thousandSeperatorFormatter,
  thousandSeperatorAddFormatter,
//   timeFormatterYMDH,
  getEnableKey,
  gridHeightScroll5Row,
  gridHeightNoScroll,
  gridHeightScroll,
  gridHeightPageScroll,
  gridRowHeight,
  gridUtilDefaultColDef,
  gridUtilDefaultOptions,
  gridHeightFullNoScroll,
  gridHeightFullScroll,
  gridHeightFullPageScroll,
  gridOverLayTemplate,
  gridUtilRowClickSelection,
  gridUtilDragLeaveHideColumns,
};
