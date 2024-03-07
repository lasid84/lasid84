'use client'

import { NavigationState, useNavigation } from "states/useNavigation";
import { memo } from "react"
import { usePathname, useSearchParams } from "next/navigation";


function getMenuTitle(menu: NavigationState[], url:string, menu_param:string|null):string|undefined {
    var title;
    for (var obj of menu) {
      if (obj.items.length > 0) {
        title = getMenuTitle(obj.items, url, menu_param);
        if (title) return title;
      } else {
        if (obj.url === url && obj.menu_param === menu_param) return obj.title;
      }
    }
  }

const Title: React.FC = memo(() => {

    const navigation = useNavigation((state) => state.navigation);
    const router = usePathname();
    const queryParam = useSearchParams();
    const params = queryParam.get('params');
    const title = getMenuTitle(navigation, router, params);

    return (
        <div className="text-lg font-bold">{title}</div>
    );
});

export default Title;