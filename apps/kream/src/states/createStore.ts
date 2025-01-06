import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const createStore = <T>(initState: (set: any) => T) => {
  return create<T>()(
    process.env.NODE_ENV !== "production" ? devtools(initState) : initState
  );
};