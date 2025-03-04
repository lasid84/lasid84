import { ReactPropTypes, createContext, useContext } from "react";

import { log, error } from '@repo/kwe-lib-new';

export const SEARCH_M = 'SEARCH_M'
export const SEARCH_D = 'SEARCH_D'
export const SEARCH_PKC = 'SEARCH_PKC'
export const SEARCH_CGD = 'SEARCH_CGD'
export const SEARCH_CST = 'SEARCH_CST'
export const LOAD = 'LOAD';

export const crudType = {
  CREATE: "C",
  UPDATE: "U",
  DELETE: "D",
  READ: "R",
};


export type State = {
    searchParams?: any[]
    dispatch?: any    
    selectedRow?: any[]
    crudType?: 'C' | 'R' | 'U' | 'D'
    isSearch?: any[]
    isPopUpOpen?: any[]
  };

export const PageState = {
  searchParams: [{}],
  selectedRow: [null, null],
  isSearch: [false, false]
};

export const TableContext = createContext<State>({
  ...PageState
  });

  export const reducer = (state:State, action:any) => {
    var type = action.type? action.type : 'type';
    switch (type) {
      default:
        log("default", state, action);
        return {
          ...state,
          ...action
        }
    }
  }  

export function useAppContext() {
    return useContext(TableContext);
}