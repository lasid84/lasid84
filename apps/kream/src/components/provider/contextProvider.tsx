import { ReactPropTypes, createContext, useContext } from "react";

const { log } = require('@repo/kwe-lib/components/logHelper');

export const SEARCH = 'SEARCH';
export const SEARCH_FINISH = 'SEARCH_FINISH';
export const LOAD = 'LOAD';
export const SELECTED_ROW = 'SELECTED_ROW';
export const SET_CHANGESELECT = 'SET_CHANGESELECT';
export const ROW_CLICK = 'ROW_CLICK';
export const NEW = 'NEW';

export const PopType = {
  CREATE: "C",
  UPDATE: "U",
  DELETE: "D",
  READ: "R",
};


export type State = {
    type?: string
    searchParams?: any
    dispatch?: any    
    selectedRow?: any
    inputValue?:any
    crudType?: 'C' | 'R' | 'U' | 'D'

    isSearch?: boolean
    isChangeSelect?: boolean
    isGridClick?: boolean
    isGridRowAdd?: boolean,
    isGridRowDelete?: boolean,
  };

export const PageState = {
    type: '',
    searchParams: {},
    selectedRow: {},

    isSearch: false,
    isChangeSelect: false,
    isGridClick: false,
    isGridRowAdd: false,
    isGridRowDelete: false,
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
        return {
          ...state,
          ...action
        }
    }
  
    return state;
  }  

export function useAppContext() {
    return useContext(TableContext);
}