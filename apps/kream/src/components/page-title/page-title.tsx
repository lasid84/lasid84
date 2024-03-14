'use client'

import { NavigationState, useNavigation } from "states/useNavigation";
import { memo } from "react";
import {FiPlus} from "react-icons/fi";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { navigate } from "services/serverAction";
// import Breadcrumb,{ BreadcrumbItemProps } from  "@repo/ui/src/breadcrumb/breadcrumb"; 
const { log } = require('@repo/kwe-lib/components/logHelper');

export type PageTitleProps = {
  desc?: string;
  // brcmp?: BreadcrumbItemProps[];
  brcmp?:any;
};

function getMenuTitle(menu: NavigationState[], url:string, menu_param:string|null, parent = true):string|undefined {
  var title;
  for (var obj of menu) {
    if (obj.items.length > 0) {
      title = getMenuTitle(obj.items, url, menu_param, false);
      
      if (title) return title;
    } else {
      // log("title", obj, menu, url, menu_param);
      if (obj.url === url && obj.menu_param === (menu_param || '')) return obj.title;
    }
  }

  if (!title && parent && url !== "/dashboard") {
    log("==page-title", menu, url);
    navigate("/not-found")
  }
}

const PageTitle: React.FC<PageTitleProps> = memo(({desc, brcmp}) => {

  const { t } = useTranslation();
  const navigation = useNavigation((state) => state.navigation);
  const router = usePathname();
  const queryParam = useSearchParams();
  const params = queryParam.get('params');
  const title = getMenuTitle(navigation, router, params);

  return (
    <div className="w-full mb-1">
      <div className="flex flex-row items-center justify-between mb-2">
        <div className="flex flex-col">
           <div className="text-lg font-bold">{t(title!)}</div>
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
    </div>
  );
});

export default PageTitle;
