'use client'

import { LOAD } from "components/provider/contextObjectProvider";
import { SP_Load } from "./_component/data";
import { useGetData } from "components/react-query/useMyQuery";
import BookmarkTab from "./_component/bookmarkTab";
import InterfaceTab from "./_component/interfaceTab";

import { logger } from "@repo/kwe-lib-new";

const Home: React.FC = () => {
  const { data: initData } : any = useGetData("", LOAD, SP_Load, {staleTime: 1000 * 60 * 60});
  
  return (
    <div>
      <BookmarkTab loadItem={initData} />
      <InterfaceTab />
    </div>
  );
}

export default Home;
