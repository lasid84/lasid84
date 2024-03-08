import { executFunction } from "@/services/api.services";
import i18n, { ResourceStore } from "i18next";
import { initReactI18next } from "react-i18next";
import { getSession } from 'services/serverAction';
import Backend from 'i18next-xhr-backend';
const { log } = require('@repo/kwe-lib/components/logHelper');

var resources = {};
const SP_GetData = async () => {
    
    // const session = await getSession();
    // log(session?.user);
    const params = {
      inparam : [
          "in_menu_type"
        , "in_user_id"
        , "in_ipaddr"
      ],
      invalue: [
          ""
        , ""
        , ""
      ],
      inproc: 'public.f_admn_get_languageset',
      isShowLoading: false
    }
    
    const result = await executFunction(params);
    return result![0];
}

export async function setI18n(lang:string) {

    log("시작 : ", i18n);
    
    const languages:any = await SP_GetData();
    let objEN:any = {};
    let objKO:any = {};
    let objJP:any = {};

    // log("objEN", objEN);
    // log("objKO", objKO);
    // log("objEN", objJP);

    languages.map((row:any) => {
        objEN[row.code] = row.eng ? row.eng : row.code;
        objKO[row.code] = row.kor ? row.kor : row.code;
        objJP[row.code] = row.jpn ? row.jpn : row.code;
    });
    
    // resources = {
    //     en: {
    //         translation: objEN
    //     },
    //     ko: {
    //         translation: objKO
    //     },
    //     jp: {
    //         translation: objJP
    //     }
    // };    

    i18n.addResourceBundle('ENG', 'translation', objEN);
    i18n.addResourceBundle('KOR', 'translation', objKO);
    i18n.addResourceBundle('JPN', 'translation', objJP);
    i18n.changeLanguage(lang);

    log("seti18n 종료",i18n);
}


i18n
    // .use(Backend)
    .use(initReactI18next)
    .init({
        debug: process.env.NODE_ENV === 'development' ? true : false,
        // resources,
        defaultNS: "translation",
        // lng: lang ? lang : 'ko', // 기본 설정 언어, 'cimode'로 설정할 경우 키 값으로 출력된다.
        // fallbackLng: ["KOR", "ENG", "JPN"], // 번역 파일에서 찾을 수 없는 경우 기본 언어
        lng: 'KOR',
        fallbackLng: "KOR"
        // interpolation: {
        //     escapeValue: false
        // }
    });

export default i18n;