import { ReactPropTypes, createContext, useContext } from "react";

const { log } = require('@repo/kwe-lib/components/logHelper');

export const SEARCH_M = 'SEARCH_M';
export const SEARCH_D = 'SEARCH_D';
export const LOAD = 'LOAD';

export const crudType = {
  CREATE: "C",
  UPDATE: "U",
  DELETE: "D",
  READ: "R",
};


export type State = {
    type?: string
    searchParams?: any
    dispatch?: any    
    mSelectedRow?: any    //마스터 그리드 선택 Row
    dSelectedRow?: any    //디테일 그리드 선택 Row
    inputValue?: any
    crudType?: 'C' | 'R' | 'U' | 'D'

    isMSearch?: boolean
    isDSearch?: boolean
    isMChangeSelect?: boolean
    isDChangeSelect?: boolean
    isPopUpOpen?: boolean
  };

export const PageState = {
  
    searchParams: {},
    mSelectedRow: {},
    dSelectedRow: {},
    

    isMSearch: false,
    isDSearch: false,
    isPopUpOpen: false,
  };

export const TableContext = createContext<State>({
  ...PageState
  });

  export const reducer = (state:State, action:any) => {
    var type = action.type? action.type : 'type';
    switch (type) {
      case LOAD:
        const { params } = action;
        
      //   // return useGetData(params);
      // case SEARCH:
      //   return {
      //     ...state,
      //     searchParams: {
      //       ...state.searchParams,
      //       ...action.params
      //     },
      //     isSearch: true
      //   }
      // case SEARCH_FINISH:
      //   return {
      //     ...state,
      //     isSearch: action.isSearch
      //   }
      // case SELECTED_ROW:
      //   // log("data", JSON.stringify(action.selectedRow));
      //   return {
      //     ...state,
      //     selectedRow:action.selectedRow,
      //   }
      // case ROW_CLICK:
      // case NEW:
      //   // log("data", JSON.stringify(action.selectedRow));
      //   return {
      //     ...state,
      //     ...action,
      //     isChangeSelect:!state.isChangeSelect
      //   }
      default:
        // log("default", state, action);
        // return {
        //   ...state,
        //   ...action
        // }
        return Object.assign({}, state, action);
    }
  
    return state;
  }  

export function useAppContext() {
    return useContext(TableContext);
}