'use client'

import { NavigationState, useNavigation } from "states/useNavigation";
import { memo, useState, useEffect } from "react";
import {FiPlus} from "react-icons/fi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { navigate } from "services/serverAction";
import { useUserSettings } from "@/states/useUserSettings";
import { shallow } from "zustand/shallow";
import { toastError } from "../toast";
// import Breadcrumb,{ BreadcrumbItemProps } from  "@repo/ui/src/breadcrumb/breadcrumb"; 
const { log } = require('@repo/kwe-lib/components/logHelper');


export type PageTitleProps = {
  desc?: string;
  // brcmp?: BreadcrumbItemProps[];
  brcmp?:any;
};

// function getMenuTitle(menu: NavigationState[], url:string, menu_param:string|null, parent = true):string|undefined {
//   if (!menu) return '';
//   var title;
//   for (var obj of menu) {
//     if (obj.items.length > 0) {
//       title = getMenuTitle(obj.items, url, menu_param, false);
//       // log('tlte', title)
//       if (title) return title;
//     } else {
//       // log("title", obj, menu, url, menu_param);
//       if (obj.url === url && obj.menu_param === (menu_param || '')) return obj.title;
//       // else return undefined;
//     }
//   }

//   if (!title && parent && (url !== "/dashboard" && url !== "/")) {
//     log("==page-title", menu, url);
//     // navigate("/not-found")
//   }
// }

function getMenuTitle(menu: NavigationState[], menu_seq: number):string|undefined {
  if (!menu) return '';
  // log("getMenuTitle", menu, menu_seq);
  var title;
  for (var obj of menu) {
    if (obj.items.length > 0) {
      title = getMenuTitle(obj.items, menu_seq);
      if (title) return title;
    } else {
      if (obj.menu_seq === menu_seq ) return obj.title;
    }
  }
}

const PageTitle: React.FC<PageTitleProps> = memo(({desc, brcmp}) => {

  const { t } = useTranslation();
  const [title, setTitle] = useState('');

  const navigation = useNavigation((state) => state.navigation);
  const isReady = useNavigation((state) => state.isReady);
  const router = useRouter();
  const queryParam = useSearchParams();
  const params = queryParam.get('params');
  // log("==========PageTitle", queryParam, params, " / ");
  // const title = getMenuTitle(navigation, router, params);
  const menu_seq = useUserSettings((state) => state.data.currentMenu, shallow)
  // const title = getMenuTitle(navigation, menu_seq);

  useEffect(() => {
    // log("isReady: ", isReady)
    if (!isReady) return;

    let title = getMenuTitle(navigation, menu_seq) || '';
    setTitle(title)

    // log("isReady menu_seq, title: ", menu_seq, title)
    if (menu_seq !== 0 && title === '') {
      setTitle(title)
      toastError("권한이 없습니다.")
      router.replace('/');
    }
  }, [isReady, navigation, menu_seq])

  return (
    // <div className="w-full">
      <div className="flex flex-row items-center justify-between w-1/2 mt-1">
        <div className="flex flex-col">
           <div className="px-6 text-lg font-bold">{t(title!)}</div>
           { desc && 
            <div className="text-xs font-light text-gray-500 uppercase">
                {desc}
            </div>
            }
        </div>
        { brcmp && 
        <div className="flex flex-row mb-1">
            <div className="w-full">
            {/* <Breadcrumb items={brcmp} home={true} icon="chevrons" /> */}
            </div>
        </div>
        }       
      </div>
    // </div>
  );
});

export default PageTitle;
