// import { executFunction } from "@/services/api.services";
// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// // import translationEN from "locales/en/translation.json";
// // import translationKO from "locales/ko/translation.json";

// export const SP_GetData = async (searchParam: any) => {
//     // console.log('searchParam', searchParam.queryKey[1])
//     const Param = searchParam.queryKey[1]
  
//     const {trans_mode, trans_type, user_id, ipaddr } = Param;
//     // log("searchData:", trans_mode, trans_type);
    
//     const params = {
//       inparam : [
//           "in_menu_type"
//         , "in_user_id"
//         , "in_ipaddr"
//       ],
//       invalue: [
//           ""
//         , user_id
//         , ipaddr
//       ],
//       inproc: 'public.f_admn_get_languageset',
//       isShowLoading: false
//       }
    
//       const result = await executFunction(params);
//       return result![0];
// }

// async function setI18n() {

//     const ttt = await SP_GetData('');

//     const resources = {
//     en: {
//         translation: ttt
//     },
//     ko: {
//         translation: ttt
//     }
//     };

//     i18n
//     .use(initReactI18next)
//     .init({
//         resources,
//         lng: "ko", // 기본 설정 언어, 'cimode'로 설정할 경우 키 값으로 출력된다.
//         fallbackLng: "en", // 번역 파일에서 찾을 수 없는 경우 기본 언어
//         interpolation: {
//         escapeValue: false
//         }
//     });
// }

// export default i18n;