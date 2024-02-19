import { createContext, useContext } from "react";

export type State = {
    searchParams: any
    dispatch: any
    needSearch: boolean
  };

export const TableContext = createContext<State>({
    searchParams: {},
    dispatch: () => {},
    needSearch: false
  });

export function useAppContext() {
    return useContext(TableContext);
}