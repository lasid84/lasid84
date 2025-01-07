import { useUserSettings } from '@/states/useUserSettings';
import { usePathname } from 'next/navigation';

export const paramsUtils = (Params: any = {}) => {
    const userInfo = useUserSettings.getState().data;
    let cols = ["user_id", "ipaddr"];

    for (let col of cols) {
        if (!Params[col]) {
            // if (userInfo.hasOwnProperty(col)) {
                Params[col] = userInfo[col as keyof typeof userInfo];
            // }
        }
    }

    return Params;
  };
