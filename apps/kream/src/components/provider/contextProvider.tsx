import { createContext, useContext } from "react";

export const SEARCH = 'SEARCH';
export const SEARCH_FINISH = 'SEARCH_FINISH';
export const LOAD = 'LOAD';
export const SELECTED_ROW = 'SELECTED_ROW';
export const SET_ISSELECT = 'SET_ISSELECT';


export type State = {
    searchParams: any
    dispatch?: any
    needSearch: boolean
    selectedRow?: {},
    isChangeSelect?: boolean
  };

export const PageState = {
    searchParams: {},
    needSearch: false,
    selectedRow: {},
    isChangeSelect: false
  };

export const TableContext = createContext<State>({
  ...PageState
  });

  export const reducer = (state:State, action:any) => {
  
    switch (action.type) {
      case LOAD:
        const { params } = action;
        
        // return useGetData(params);
      case SEARCH:
        return {
          ...state,
          searchParams: {
            ...state.searchParams,
            ...action.params
          },
          needSearch: true
        }
      case SEARCH_FINISH:
        return {
          ...state,
          needSearch: action.needSearch
        }
      case SELECTED_ROW:
        // log("data", JSON.stringify(action.selectedRow));
        return {
          ...state,
          selectedRow:action.selectedRow,
          isChangeSelect:true
        }
      case SET_ISSELECT:
        // log("data", JSON.stringify(action.selectedRow));
        return {
          ...state,
          isChangeSelect:!state.isChangeSelect
        }
    }
  
    return state;
  }  

export function useAppContext() {
    return useContext(TableContext);
}