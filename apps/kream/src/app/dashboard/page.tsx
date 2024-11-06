'use client'

import { LOAD } from "components/provider/contextObjectProvider";
import { SP_Load } from "./_component/data";
import { useGetData } from "components/react-query/useMyQuery";
import BookmarkTab from "./_component/bookmarkTab";
import InterfaceTab from "./_component/interfaceTab";

// 개발 이력 데이터
const developmentHistory = [
  {
    date: '2024-09-13',
    title: 'Version 0.2.0 Released',
    description: '1. 개발 진행 중인 내용 <br>' 
     + '&nbsp;1) 메일 발송 및 메일 템플릿, 첨부파일 관리 기능(운송사, 화주등)<br>'
     + '&nbsp;2) 마일스톤 자동 생성 기능<br>'
  },
  {
    date: '2024-07-25',
    title: 'Version 0.1.0 Released',
    description: '1. Charge Upload <br>' 
     + '&nbsp;1) 엑셀 업로드 후 저장 클릭하도록 변경<br>'
     + '&nbsp;2) 인보이스 발행 기능 적용<br>'
     + '&nbsp;&nbsp;- invoice date 가 없을 경우 발행 안됨<br>'
     + '&nbsp;3) 연동되는 UFS+ 사이트(테스트 사이트)<br>'
     + '&nbsp;&nbsp;- https://uat-jp.ufsplus.kwe.com/web/<br>'
     + '&nbsp;4) 인보이스 컨펌 기능 개발 중<br>'
  },
];

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
