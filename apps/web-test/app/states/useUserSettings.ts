import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type OptionProps = {
  label: string;
  value: string;
  id: number;
};

// Define a type for the state
interface UserSettingsState {
  user_id: string;
  user_nm: string;
  /*KREAM용 추가*/ 
  permission_id: string;
  user_grp_id: string;
  office_cd: string;
  dept_cd: string;
  trans_mode: string;
  trans_type: string;
  ufs_id:string;
  token:string
  /*KREAM용 추가 끝*/

  // user_lev: string;
  // user_type: string;
  // email?: string;
  // selected_cust_biz_name: string;
  // selected_cust_biz_id: number;
  // selected_cust_biz_key: string;
  // selected_wh_name: string;
  // selected_wh_id: number;
  // selected_wh_key: string;
  // cust_biz_list: OptionProps[];
  // wh_list: OptionProps[];
}

// Define the initial state using that type
const initialState: UserSettingsState = {
  user_id: "",
  user_nm: "",

  /*KREAM용 추가*/ 
  permission_id: "",
  user_grp_id: "",
  office_cd: "",
  dept_cd: "",
  trans_mode: "",
  trans_type: "",
  ufs_id: "",
  token: "",
  /*KREAM용 추가 끝*/
  // user_lev: "",
  // user_type: "",
  // email: "",
  // selected_cust_biz_name: "",
  // selected_cust_biz_id: 0,
  // selected_cust_biz_key: "",
  // selected_wh_name: "",
  // selected_wh_id: 0,
  // selected_wh_key: "",
  // cust_biz_list: [{ label: "", value: "", id: 0 }],
  // wh_list: [{ label: "", value: "", id: 0 }],
};

type UserSettingsStore = {
  data: UserSettingsState;
  actions: {
    setData: (payload: Partial<UserSettingsState>) => void;
  };
};

const userSettingsStore = (set: any) => ({
  data: initialState,
  actions: {
    setData: (payload: Partial<UserSettingsState>) => {
      set((state: any) => ({
        data: {
          ...state.data,
          ...payload,
        },
      }));
    },
  },
});

const persistUserSettingsStore = persist(
  process.env.NODE_ENV !== "production" ? devtools(userSettingsStore) : userSettingsStore,
  {
    name: "USER_SETTINGS",
    storage: createJSONStorage(() => localStorage),
    partialize: ({ actions, ...rest }: any) => rest,
  }
);

export const useUserSettings = create<UserSettingsStore>()(persistUserSettingsStore);
