import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware'

// Define a type for the state
interface ConfigState {
    name: string;
    description: string;
    url: string;
    layout: string;
    collapsed: boolean;
    rightSidebar: boolean;
    background: string;
    lang: string;
}
  
// Define the initial state using that type
const initialState: ConfigState = {
    name: "KREAM",
    description: "KREAM",
    url: "https://www.kwe.co.kr",
    layout: "layout-1",
    collapsed: false,
    rightSidebar: false,
    background: "light",
    lang: "ko",
};

type ConfigsStore = {
    config: ConfigState;
    actions: {
        setConfig: (payload: Partial<ConfigState>)=> void; 
    }
 }

export const useConfigs = create<ConfigsStore>( set => ({
    config: initialState,
    actions: {
        setConfig: (payload: Partial<ConfigState>) => {
            set(state => ({
                config: {
                    ...state.config,
                    ...payload
                }
            }));
        },
    },
}));  


export default initialState;
