import { create } from 'zustand';

interface LeftSidebarState {
    showButtonText: boolean;
    showSectionTitle: boolean;
    showLogo: boolean;
    showCard: boolean;
    showAccountLinks: boolean;
    showProjects: boolean;
    showTags: boolean;
    card: number;
}

// Define the initial state using that type
const initialState: LeftSidebarState = {
    showButtonText: true,
    showSectionTitle: true,
    showLogo: true,
    showCard: true,
    showAccountLinks: false,
    showProjects: true,
    showTags: true,
    card: 1,
};

type LeftSidebarStore = {
    leftSidebar: LeftSidebarState;
    actions: {
        setLeftSidebar: (payload: Partial<LeftSidebarState>) => void;
    }
}

export const useLeftSidebar = create<LeftSidebarStore>( set => ({
    leftSidebar: initialState,
    actions: {
        setLeftSidebar: (payload: Partial<LeftSidebarState>) => {
            set(state => ({
                leftSidebar: {
                    ...state.leftSidebar,
                    ...payload
                }
            }));
        },
    },
}));  

  



