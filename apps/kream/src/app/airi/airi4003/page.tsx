"use client";

import SearchForm from "./_component/search-form";
import MasterGrid from "./_component/gridMaster";
import DetailGrid from "./_component/gridDetail";
import { FormProvider, useForm } from "react-hook-form";
import { useCommonStore } from "./_store/store";
import CustomerDetail from "./_component/DetailInfo";
import ResizableLayout from "../../stnd/stnd0016/_component/DetailInfo/Layout/ResizableLayout";

export default function AIRI4003() {
  const searchParams = useCommonStore((state) => state.searchParams);
  const methods = useForm({
    defaultValues: {
      ...searchParams,
    },
  });

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col h-screen space-y-2">
        <SearchForm />
        <ResizableLayout
          defaultLeftWidth={800}
          minLeftWidth={400}
          maxLeftWidth={5000}
          defaultHeight={1000}
          minHeight={800}
          maxHeight={2500}
          ratio={30}
          leftContent={<MasterGrid />}
          rightContent={
            <>
              <CustomerDetail />
              <DetailGrid />
            </>
          }
        />
      </form>
    </FormProvider>
  );
}
