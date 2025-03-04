
import { create } from 'zustand';
import { useUserSettings } from "states/useUserSettings";

// import { executFunction } from 'services/api.services';
import { executeKREAMFunction } from "@/services/api/apiClient";
import { log } from '@repo/kwe-lib-new';


//DEFAULT
import { MdOutlineWidthNormal } from "react-icons/md"

//기준정보
import { PiUserListBold } from "react-icons/pi";
import { TbUserPentagon } from "react-icons/tb";

//ACCOUNT
import { FcMoneyTransfer } from "react-icons/fc";
import { BiMoneyWithdraw } from "react-icons/bi";
import { PiHandCoinsBold } from "react-icons/pi";
import { LiaCoinsSolid } from "react-icons/lia";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

//AIR EXPORT/IMPORT
import {
  PiAirplaneTakeoffBold,
  PiAirplaneLandingBold
} from "react-icons/pi";


//OCEAN EXPORT/IMPORT
import {
  RiShip2Line,
  RiShipLine
} from "react-icons/ri";
import { BiSolidShip } from "react-icons/bi";

//계약관리
import { GrDocumentConfig } from "react-icons/gr";
import { HiDocumentSearch } from "react-icons/hi";

//관세청 유니패스
import { MdLocalShipping } from 'react-icons/md';
import { FaRegFileAlt } from 'react-icons/fa';
import { GiCargoShip } from 'react-icons/gi';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { RiGovernmentLine } from 'react-icons/ri';

import { gridData } from '@/components/grid/ag-grid-enterprise';

export type NavigationState = {
  parent_seq: number;
  menu_seq: number;
  title: string;
  url?: string | undefined;
  items: NavigationState[];
  icon?: React.ReactNode;
  menu_param?: string
  badge?: {
    color: string;
    text: string | number;
  };
};

// Define the initial state using that type
export type NavigationStore = {
  navigation: NavigationState[];
  menu_arr: string[];
  isReady?: boolean;
  openMenu: string;
  isOpen: boolean,
  actions: {
    setOpenMenu: (menuName?: string) => void;
  }
  childern?: JSX.Element | JSX.Element[]
}

function getIcon(img_index: any) {
  switch (img_index) {
    case "0":
      return <TbUserPentagon size={20} />
    case "3":
      return <PiHandCoinsBold size={20} />
    case "11":
      return <GrDocumentConfig size={20} />
    case "13":
      return <PiAirplaneLandingBold size={20} />
    case "20":
      return <BiSolidShip size={20} />
    case "21":
      return <RiShip2Line size={20} />
    case "30":
      return <MdLocalShipping size={20} />
    case "31":
      return <FaRegFileAlt size={20} />
    case "32":
      return <GiCargoShip size={20} />
    case "33":
      return <AiOutlineFileSearch size={20} />
    case "34":
      return <RiGovernmentLine size={20} />
    default:
      return <MdOutlineWidthNormal size={20} />
  }
}

async function getMenuList(userInfo: any) {

  // const inparam = ['in_permission_id','in_menu_type', 'in_user_id', 'in_ipaddr'];
  // const invalue = [userInfo.permission_id, 'UI', userInfo.user_id, '1.2.3.4'];
  // const inproc = 'public.f_admn_get_menulist';

  const params = {
    inparam: ['in_permission_id', 'in_menu_type', 'in_user_id', 'in_ipaddr'],
    invalue: [userInfo.permission_id, 'WEB', userInfo.user_id, ''],
    inproc: 'public.f_admn_get_menulist',
    isShowLoading: false
  };
  // log('params', params)
  const result = await executeKREAMFunction(params);
  if (!result) return { navigationData: undefined, menuArr: undefined };
  const menus = (result[0] as gridData);

  // log("menus", menus);

  if (!menus.data.length) return { navigationData: undefined, menuArr: undefined };

  const navigationData: NavigationState[] = [{
    parent_seq: -1,
    menu_seq: -2,
    title: '',
    items: [],
  }];

  const menuMap = new Map<number, NavigationState>();
  var menuArr: string[] = ['dashboard'];

  menus?.data?.forEach((menu: any) => {
    if (menu.use_yn === "Y") {
      // log("menus:", menu);
      const menuItem: NavigationState = {
        parent_seq: menu.parent_seq,
        menu_seq: menu.menu_seq,
        url: (menu.menu_code || '' ) === '' ? "/" : `/${menu.menu_code.substring(0, 4).toLowerCase()}/${menu.menu_code.toLowerCase()}`,
        icon: menu.parent_seq === '0' ? getIcon(menu.image_index) : undefined,
        title: menu.menu_name,
        items: [],
        menu_param: menu.menu_param
      };

      menuMap.set(menu.menu_seq, menuItem);

      if (menu.parent_seq != 0) {
        const parentMenuItem = menuMap.get(menu.parent_seq);
        if (parentMenuItem) {
          parentMenuItem.items.push(menuItem);
        }
      }

      if (menu.menu_code) menuArr.push(menu.menu_code + menu.menu_param);

    }
  });

  navigationData[0].items = Array.from(menuMap.values()).filter(
    // eslint-disable-next-line
    (menuItem) => menuItem.parent_seq == 0
  );
  return { navigationData, menuArr };
}

const useNavigationStore = create<NavigationStore>((set) => ({
  navigation: [],
  menu_arr: ['dashboard'],
  isReady: false,
  openMenu: '',
  isOpen: false,
  actions: {
    setOpenMenu: (menuName) => {
      set({ openMenu: menuName });
    },
  },
}));
export const useNavigation = useNavigationStore;

export const setNavigationData = async () => {
  const userInfo = useUserSettings.getState().data;
  //log("userInfo : ",userInfo);
  const { navigationData, menuArr } = await getMenuList(userInfo);
  useNavigationStore.setState({ navigation: navigationData, menu_arr: menuArr, isReady: true });
};
