import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
const { log } = require("@repo/kwe-lib/components/logHelper");

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
  office_cd?: string | undefined;
  dept_cd: string;
  trans_mode: string | undefined;
  trans_type?: string | undefined;
  ufs_id:string;
  token:string
  ipaddr:string
  /*KREAM용 추가 끝*/

  /* 브라우저용 추가*/
  loading : string,
  hasError : boolean,
  errMsg : string,
  /* 브라우저용 추가 끝*/
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
  ipaddr: "",
  /*KREAM용 추가 끝*/

  /*브라우저용 추가*/
  loading : "OFF",
  hasError : false,
  errMsg : "",
  /* 브라우저용 추가 끝*/
};

type UserSettingsStore = {
  data: UserSettingsState;
  actions: {
    setData: (payload: Partial<UserSettingsState>) => void;
    reset: () => void;
  };
};

const userSettingsStore = (set: any) => ({
  data: initialState,
  actions: {
    setData: (payload: Partial<UserSettingsState>) => {
      ['office_cd', 'trans_mode', 'trans_type'].forEach(col => {
        var val = payload[col as keyof UserSettingsState];
        if (val === '') {
          payload[col as keyof UserSettingsState] = 'ALL' as any;
        }
      });
      set((state: any) => ({
        data: {
          ...state.data,
          ...payload,
        },
      }));
    },
    reset: () => {
      set(() => ({
        data: initialState,
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

export const setUserSetting = async (user:any) => {
  log("setUserSetting start", user);
  await useUserSettings.setState({ data: user });
};