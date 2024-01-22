import { create } from 'zustand'

type UserState = {
    user_id: string;
    user_name: string;
    /*KREAM용 추가*/ 
    permission_id: string;
    user_grp_id: string;
    office_cd: string;
    dept_cd: string;
    trans_mode: string;
    trans_type: string;
    ufs_id:string;
    token:string
    add: () => void
}

export const UserState = create<UserState>((set) => ({
    user_id: '',
    user_name: '',
    /*KREAM용 추가*/ 
    permission_id: '',
    user_grp_id: '',
    office_cd: '',
    dept_cd: '',
    trans_mode: '',
    trans_type: '',
    ufs_id: '',
    token: '',
    add: () => set((state) => ({ ...state }))
}));