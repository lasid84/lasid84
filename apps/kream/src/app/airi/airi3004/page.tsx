"use client";

import { useEffect } from "react";
import { useFullScreen } from "hooks/useFullScreen";
import MasterGrid from "./_component/gridMaster";
import { FormProvider, useForm } from "react-hook-form";
import { useCommonStore } from "./_store/store";

export default function AIRI3004() {
  const { containerRef } = useFullScreen();

  const searchParams = useCommonStore((state) => state.searchParams);
  const { getOperationListData } = useCommonStore((state) => state.actions);
  const methods = useForm({
    defaultValues: {
      ...searchParams
     },
  });

  const {
    formState: { errors, isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    getOperationListData(searchParams.fr_date);
  }, []);

  return (
    <FormProvider {...methods}>
      <form>
        <div ref={containerRef} className={`flex-row w-full h-[calc(100vh-55px)]`}>
          <MasterGrid />
        </div>
      </form>
    </FormProvider>
  );
}