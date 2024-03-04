import { executFunction } from "@/services/api.services";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getSession } from 'services/serverAction';
import Backend from 'i18next-xhr-backend';
const { log } = require('@repo/kwe-lib/components/logHelper');

export const SP_GetData = async () => {
    
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

export async function setI18n() {

    const languages:any = await SP_GetData();
    let objEN:any = {};
    let objKO:any = {};
    let objJP:any = {};

    log("objEN", objEN);
    log("objKO", objKO);
    log("objEN", objJP);

    languages.map((row:any) => {
        objEN[row.code] = row.eng ? row.eng : row.code;
        objKO[row.code] = row.kor ? row.kor : row.code;;
        objJP[row.code] = row.jpn ? row.jpn : row.code;;
    });

    const resources = {
        en: {
            translation: objEN
        },
        ko: {
            translation: objKO
        },
        jp: {
            translation: objJP
        }
    };

    // i18n
    // .use(Backend)
    // .use(initReactI18next)
    // .init({
    //     // resources,
    //     lng: lang ? lang : 'ko', // 기본 설정 언어, 'cimode'로 설정할 경우 키 값으로 출력된다.
    //     fallbackLng: "en", // 번역 파일에서 찾을 수 없는 경우 기본 언어
    //     interpolation: {
    //         escapeValue: false
    //     }
    // });

    i18n.addResourceBundle('en', 'translation', objEN);
    i18n.addResourceBundle('ko', 'translation', objKO);
    i18n.addResourceBundle('jp', 'translation', objJP);

    // log(i18n);
}

i18n
    // .use(Backend)
    .use(initReactI18next)
    .init({
        // resources,
        // lng: lang ? lang : 'ko', // 기본 설정 언어, 'cimode'로 설정할 경우 키 값으로 출력된다.
        fallbackLng: "ko", // 번역 파일에서 찾을 수 없는 경우 기본 언어
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;