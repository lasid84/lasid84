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
    objState?: any
    dispatch?: any
  };

export const PageState = {
  objState : {}
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
          // ...state,
          objState: {
            ...state.objState,
            ...action
          }
        }
    }
  }  

export function useAppContext() {
    return useContext(TableContext);
}