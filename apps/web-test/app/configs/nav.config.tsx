import {
  FiCheckCircle,
  FiCompass,
  FiEye,
  FiFileText,
  FiHelpCircle,
  FiList,
  FiLogIn,
  FiLogOut,
  FiMove,
  FiShare2,
  FiShoppingBag,
  FiTool,
  FiTrello,
  FiTruck,
  FiUser,
  FiVolume1,
} from "react-icons/fi";
import type { NavigationState } from "@/app/states/useNavigation";

export const initialState: NavigationState[] = [
  {
    title: "Applications",
    items: [
      {
        url: "/",
        icon: <FiCompass size={20} />,
        title: "대시보드",
        items: [
          {
            url: "/com/dashboard",
            title: "대시보드",
            items: [],
          },
        ],
      },
      {
        url: "/",
        icon: <FiUser size={20} />,
        title: "고객사",
        items: [
          {
            url: "/cust/cust-asn-order",
            title: "입고지시",
            items: [],
          },
          {
            url: "/cust/cust-so-order",
            title: "출고지시",
            items: [],
          },
        ],
      },
      // {
      //   url: "/",
      //   icon: <FiCheckCircle size={20} />,
      //   title: "작성중",
      //   items: [
      //     {
      //       url: "/base/cust-biz-list",
      //       title: "고객BIZ조회",
      //       items: [],
      //     },
      //   ],
      // },
      {
        url: "/",
        icon: <FiLogIn size={20} />,
        title: "입고",
        items: [
          {
            url: "/asn/asn-reg",
            title: "입고지시",
            items: [],
          },
          // {
          //   url: "/asn/asn-order",
          //   title: "입고지시-현황",
          //   items: [],
          // },
          {
            url: "/asn/asn-process",
            title: "입고진행",
            items: [],
          },
          // {
          //   url: "/asn/asn-order-list",
          //   title: "입고조회",
          //   items: [],
          // },
          {
            url: "/asn/asn-list",
            title: "입고현황",
            items: [],
          },
        ],
      },
      {
        url: "/",
        icon: <FiLogOut size={20} />,
        title: "출고",
        items: [
          {
            url: "/so/so-reg",
            title: "출고지시",
            items: [],
          },
          // {
          //   url: "/so/so-order",
          //   title: "출고지시-현황",
          //   items: [],
          // },
          {
            url: "/so/so-process",
            title: "출고진행",
            items: [],
          },
          {
            url: "/so/so-list",
            title: "출고현황",
            items: [],
          },
          {
            url: "/so/so-deliv",
            title: "배송현황",
            items: [],
          },
          // {
          //   url: "/so/so-detail",
          //   title: "출고상세",
          //   items: [],
          // },
          // {
          //   url: "/so/so-order-reg",
          //   title: "출고지시등록",
          //   items: [],
          // },
        ],
      },
      {
        url: "/",
        icon: <FiShoppingBag size={20} />,
        title: "재고",
        items: [
          {
            url: "/inven/inven-list",
            title: "재고조회",
            items: [],
          },
          {
            url: "/inven/inven-tran-list",
            title: "재고수불조회",
            items: [],
          },
          {
            url: "/inven/inven-bndl-list",
            title: "번들재고조회",
            items: [],
          },
          {
            url: "/inven/inven-wh-list",
            title: "창고재고조회",
            items: [],
          },
          //재고 변경 관련 메뉴
          {
            url: "/inven/adj-inven-list",
            title: "재고조정",
            items: [],
          },
          {
            url: "/inven/adj-info-list",
            title: "Lottable수정",
            items: [],
          },
          {
            url: "/inven/adj-loca-list",
            title: "Location이동",
            items: [],
          },
        ],
      },
      {
        url: "/",
        icon: <FiShoppingBag size={20} />,
        title: "창고",
        items: [
          {
            url: "/movewh/move-wh-list",
            title: "창고이동",
            items: [],
          },
          {
            url: "/movewh/wh-map",
            title: "창고위치조회",
            items: [],
          },
          {
            url: "/move/wh-visualization",
            title: "창고시각화",
            items: [],
          },
        ],
      },
      // {
      //   url: "/",
      //   icon: <FiTruck size={20} />,
      //   title: "배송",
      //   items: [
      //     {
      //       url: "/so/deliv-list",
      //       title: "배송조회",
      //       items: [],
      //     },
      //     {
      //       url: "/so/deliv-epod",
      //       title: "EPOD",
      //       items: [],
      //     },
      //   ],
      // },
      // {
      //   url: "/",
      //   icon: <FiMove size={20} />,
      //   title: "이동",
      //   items: [
      //     {
      //       url: "/move/move-list",
      //       title: "창고이동조회",
      //       items: [],
      //     },
      //   ],
      // },
      {
        url: "/",
        icon: <FiShare2 size={20} />,
        title: "연계",
        items: [
          {
            url: "/edi/edi-list",
            title: "EDI조회",
            items: [],
          },
          {
            url: "/edi/file-ftp-list",
            title: "파일연계조회",
            items: [],
          },
          // {
          //   url: "/edi/file-ftp-reg",
          //   title: "파일연계등록",
          //   items: [],
          // },
        ],
      },
      // {
      //   url: "/",
      //   icon: <FiVolume1 size={20} />,
      //   title: "알림",
      //   items: [
      //     {
      //       url: "/adm/noti-list",
      //       title: "알림조회",
      //       items: [],
      //     },
      //     {
      //       url: "/adm/noti-reg",
      //       title: "알림등록",
      //       items: [],
      //     },
      //     {
      //       url: "/adm/noti-send-list",
      //       title: "알림전송조회",
      //       items: [],
      //     },
      //   ],
      // },
      // {
      //   url: "/",
      //   icon: <FiTrello size={20} />,
      //   title: "관리리포트",
      //   items: [
      //     {
      //       url: "/report/undifined",
      //       title: "리포트설정",
      //       items: [],
      //     },
      //   ],
      // },
      {
        url: "/",
        icon: <FiFileText size={20} />,
        title: "기준정보",
        items: [
          {
            url: "/base/cust-biz-reg",
            title: "고객사-BIZ 관리",
            items: [],
          },
          {
            url: "/base/cust-sku-list",
            title: "SKU 관리",
            items: [],
          },
          {
            url: "/base/cust-sku-loca",
            title: "SKU 보관위치 관리",
            items: [],
          },
          {
            url: "/base/sku-change-list",
            title: "SKU 변경내역",
            items: [],
          },
          {
            url: "/base/partner-ship-addr-list",
            title: "파트너-배송처 관리",
            items: [],
          },
          {
            url: "/base/deliv-comp-car-list",
            title: "배송사-차량 관리",
            items: [],
          },
          // {
          //   url: "/base/deliv-car-list",
          //   title: "배송차량조회",
          //   items: [],
          // },
          {
            url: "/base/wh-list",
            title: "물류센터-구역 관리",
            items: [],
          },
          {
            url: "/base/rack-loca-list",
            title: "랙-보관위치 관리",
            items: [],
          },
          {
            url: "/base/team-list",
            title: "팀 관리",
            items: [],
          },
          {
            url: "/base/bs-noti-list",
            title: "공지사항",
            items: [],
          },
        ],
      },
      {
        url: "/",
        icon: <FiTool size={20} />,
        title: "Admin",
        items: [
          {
            url: "/adm/adm-user-list",
            title: "사용자조회",
            items: [],
          },
          {
            url: "/adm/adm-cust-wh-list",
            title: "고객사-물류창고 관리",
            items: [],
          },
          {
            url: "/adm/adm-pgm-list",
            title: "프로그램 관리",
            items: [],
          },
          // {
          //   url: "/adm/adm-grant-reg",
          //   title: "프로그램권한등록",
          //   items: [],
          // },
          // {
          //   url: "/adm/adm-user-level",
          //   title: "사용자권한레벨관리",
          //   items: [],
          // },
          {
            url: "/adm/adm-grant-list",
            title: "역할프로그램관리",
            items: [],
          },
          {
            url: "/adm/sys-code-list",
            title: "공통코드",
            items: [],
          },
          {
            url: "/adm/biz-com-code-list",
            title: "고객사별공통코드",
            items: [],
          },
          {
            url: "/adm/adm-lang-list",
            title: "다국어정의 관리",
            items: [],
          },
          // {
          //   url: "/adm/undifined",
          //   title: "알림조회(관리)",
          //   items: [],
          // },
        ],
      },
      // {
      //   url: "/",
      //   icon: <FiEye size={20} />,
      //   title: "예제화면",
      //   items: [
      //     {
      //       url: "/test/test01",
      //       title: "01.AG-GRID 예제",
      //       items: [],
      //     },
      //     {
      //       url: "/test/test02",
      //       title: "02.TAB 예제",
      //       items: [],
      //     },
      //     {
      //       url: "/test/test-layout-sample",
      //       title: "03.카드,버튼 예제",
      //       items: [],
      //     },
      //     {
      //       url: "/example/login-new-1",
      //       title: "04.로그인1",
      //       items: [],
      //     },
      //     {
      //       url: "/example/login-2",
      //       title: "05.로그인2",
      //       items: [],
      //     },
      //   ],
      // },
      // {
      //   url: "/",
      //   icon: <FiList size={20} />,
      //   title: "Menu levels",
      //   items: Array.from(Array(4).keys()).map((i) => {
      //     return {
      //       url: "/",
      //       title: `Level 1-${i + 1}`,
      //       items: Array.from(Array(4).keys()).map((j) => {
      //         return {
      //           url: "/",
      //           title: `Level 2-${j + 1}`,
      //           items: Array.from(Array(4).keys()).map((k) => {
      //             return {
      //               url: "/",
      //               title: `Level 3-${k + 1}`,
      //               items: Array.from(Array(4).keys()).map((l) => {
      //                 return {
      //                   url: "/",
      //                   title: `Level 4-${l + 1}`,
      //                   items: [],
      //                 };
      //               }),
      //             };
      //           }),
      //         };
      //       }),
      //     };
      //   }),
      // },
    ],
  },
  // {
  //   title: "Docs",
  //   items: [
  //     {
  //       url: "/",
  //       icon: <FiHelpCircle size={20} />,
  //       title: "업무매뉴얼",
  //       items: [
  //         {
  //           url: "/docs",
  //           title: "업무매뉴얼",
  //           items: [],
  //         },
  //       ],
  //     },
  //   ],
  // },
];
