import { useState } from "react";
import { usePathname, useSearchParams  } from "next/navigation";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import type { NavigationState } from "states/useNavigation";
import { useTranslation } from "react-i18next";
import { useStore } from "utils/zustand";
import { useUserSettings } from "states/useUserSettings";
const { log } = require('@repo/kwe-lib/components/logHelper');


const Item: React.FC<NavigationState> = ({menu_seq, url, icon, title, badge, items, menu_param}) => {
  const {t} = useTranslation();
  const userSettingsActions = useStore(useUserSettings, (state) => state.actions);
  
  const [hidden, setHidden] = useState<boolean>(true);

  const pathname = usePathname();
  const queryParam = useSearchParams();
  const params = queryParam.get('params');
  
  let active = pathname === url && (!params || (params == menu_param)) ? true : false;

  if (pathname === "/" && url === "/dashboard") {
    active = true;
  }
  if (pathname === "/" && url !== "/dashboard") {
    active = false;
  }
  if (items.length === 0) {
    var query;
    if (menu_param) query = {params:menu_param};

    const handleClick = () => {
      userSettingsActions?.setData({currentMenu:menu_seq, currentParams:menu_param});
    }

    return (
      // <Link href={url as string} className={`left-sidebar-item ${active ? "active" : ""} dark:bg-[#e9eef5]`}>
      <div onClick={handleClick}>
      <Link href={{
        pathname: url,
        query: { ...query }
        }}
        as= {url}
        className={`left-sidebar-item ${active ? "active" : ""} dark:bg-gray-900 dark:text-white dark:border-gray-800`}>
          {icon}
          <span className="w-full title">{t(title)}</span>
          {badge && (
            <span className={`badge badge-circle badge-sm ${badge.color}`}>
              {badge.text}
            </span>
          )}
        {/* onClick={log("item onClick", items)}s */}
      </Link>
      </div>
    );
  }
  return (
    <button
      onClick={() => setHidden(!hidden)}
      className={`left-sidebar-item ${active ? "active" : ""} ${
        hidden ? "hidden-sibling " : "open-sibling "      }`}>
      {icon}
      <span className="title">{t(title)}</span>
      {badge && (
        <span className={`badge badge-circle badge-sm ${badge.color}`}>
          {badge.text}
        </span>
      )}
      <FiChevronRight className="ml-auto arrow" />
    </button>
  );
};

export default Item;
