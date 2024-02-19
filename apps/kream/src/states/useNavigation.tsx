
import { create } from 'zustand';
import { useUserSettings } from "states/useUserSettings";

const { log } = require('@repo/kwe-lib/components/logHelper');
const { executFunction }  =  require('services/api.services');

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
    FiVolume1,
  } from "react-icons/fi";

export type NavigationState = {
    parent_seq : number;
    menu_seq : number;
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
    openMenu: string;
    isOpen: boolean,
    actions: {
        setOpenMenu: (menuName?: string) => void;
    }
    childern?: JSX.Element|JSX.Element[]
}

function getIcon(img_index:any) {
  switch(img_index)
  {
    case "0":
      return <FiCheckCircle size={20} />
    case "1":
      return <FiCompass size={20} />
    case "2":
      return <FiEye size={20} />
    case "3":
      return <FiFileText size={20} />
    case "4":
      return <FiHelpCircle size={20} />
    case "5":
      return <FiList size={20} />
    case "6":
      return <FiLogOut size={20} />
    case "7":
      return <FiMove size={20} />
    case "8":
      return <FiShare2 size={20} />
    case "9":
      return <FiTool size={20} />
    case "10":
      return <FiTrello size={20} />
    case "11":
      return <FiTruck size={20} />
    case "12":
      return <FiVolume1 size={20} />
    case "13":
      return <FiTrello size={20} />
    case "14":
      return <FiLogIn size={20} />
    default:
      return <FiShoppingBag size={20} />
  }
}



async function getMenuList (userInfo:any) {

    // console.log("getMenuList :", userInfo.permission_id);

    // const inparam = ['in_permission_id','in_menu_type', 'in_user_id', 'in_ipaddr'];
    // const invalue = [userInfo.permission_id, 'UI', userInfo.user_id, '1.2.3.4'];
    // const inproc = 'public.f_admn_get_menulist';
    
    const params = {
      inparam: ['in_permission_id','in_menu_type', 'in_user_id', 'in_ipaddr'],
      invalue: [userInfo.permission_id, 'UI', userInfo.user_id, '1.2.3.4'],
      inproc: 'public.f_admn_get_menulist',
      isShowLoading: false
    };

    const menus = await executFunction(params)
    
    log("menus", menus);

    const navigationData: NavigationState[] = [{
        parent_seq: -1,
        menu_seq: -2,
        title: '',
        items: [],
      }];

    const menuMap = new Map<number, NavigationState>();

    menus[0].forEach((menu: any) => {
    if (menu.use_yn === "Y") {
      const menuItem: NavigationState = {
        parent_seq: menu.parent_seq,
        menu_seq: menu.menu_seq,
        url: menu.menu_code === '' ? "/" : `/${menu.menu_code.substring(0,4).toLowerCase()}/${menu.menu_code.toLowerCase()}`,
        icon: menu.parent_seq === '0' ? getIcon(menu.image_index) : undefined,
        title: menu.menu_name,
        items: [],
      };

      menuMap.set(menu.menu_seq, menuItem);

      if (menu.parent_seq != 0) {
        const parentMenuItem = menuMap.get(menu.parent_seq);
        if (parentMenuItem) {
          parentMenuItem.items.push(menuItem);
        }
      }
    }
  });

  navigationData[0].items = Array.from(menuMap.values()).filter(
    // eslint-disable-next-line
    (menuItem) => menuItem.parent_seq == 0
  );

     log("navigationData", navigationData)
    return navigationData;    
}

const useNavigationStore = create<NavigationStore>((set) => ({
    navigation: [],
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
    log("setNavigationData start");
    const userInfo = useUserSettings.getState().data;
    //log("userInfo : ",userInfo);
    const navigationData = await getMenuList(userInfo);
    useNavigationStore.setState({ navigation: navigationData });
  };
  