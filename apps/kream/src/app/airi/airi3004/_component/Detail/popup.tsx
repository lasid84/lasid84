import DialogBasic from "layouts/dialog/dialog";
import { useCommonStore } from "../../_store/store";

type Props = {
    loadItem: any | null
}

const Popup: React.FC<Props> = ({ loadItem }) => {
    const popup = useCommonStore((state) => state.popup);
    const { setPopupOpen } = useCommonStore((state) => state.actions);

    const closePopup = () => {
        setPopupOpen(false);
    };

    return (
        <DialogBasic
            isOpen={popup.isOpen}
            onClose={closePopup}
            title={"배차 상세 정보"}
        >
            <form>
                {/** 전체 컨테이너 */}
                <div className="flex flex-col min-w-[1200px] monitor:min-w-[1650px] overflow-auto">
                    {/** 첫번째 영역 */}
                    <div className="flex flex-row mt-5">
                        {/** 1-1 컨테이너 */}
                        <div className="flex flex-col flex-grow mb-10">
                            {/** 제목 영역 */}
                            <div className="border-b-2 border-black">
                                <span className="text-lg">운송기본정보</span>
                            </div>
                            {/** 도표 영역 */}
                            <div className="table border-r-2 border-black">
                                <div className="table-row">
                                    <div className="table-cell p-2 bg-gray-100 border-b border-gray-500">
                                        <span>고객사명</span>
                                    </div>
                                    <div className="table-cell p-2 border-b border-gray-500">
                                        <span>한국에스엠씨 주식회사</span>
                                    </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell p-2 bg-gray-100 border-b border-gray-500">
                                        <span>요청자 이름</span>
                                    </div>
                                    <div className="table-cell p-2 border-b border-gray-500">
                                        <span>김근원</span>
                                    </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell p-2 bg-gray-100 border-b border-gray-500">
                                        <span>구분</span>
                                    </div>
                                    <div className="table-cell p-2 border-b border-gray-500">
                                        <span>일반건</span>
                                    </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell p-2 bg-gray-100 border-b border-gray-500">
                                        <span>고객사전화번호</span>
                                    </div>
                                    <div className="table-cell p-2 border-b border-gray-500">
                                        <span>042-605-2123</span>
                                    </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell p-2 bg-gray-100 border-b border-gray-500">
                                        <span>E-mail</span>
                                    </div>
                                    <div className="table-cell p-2 border-b border-gray-500">
                                        <span>KIMKW@SMCKOREA.CC</span>
                                    </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell p-2 bg-gray-100 border-b border-gray-500">
                                        <span>요청일</span>
                                    </div>
                                    <div className="table-cell p-2 border-b border-gray-500">
                                        <span>2023-01-01</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/** 1-2 컨테이너 */}
                        <div className="flex flex-col flex-grow">
                            {/** 제목 영역 */}
                            <div className="border-b-2 border-black">
                                <span className="text-lg">운송화물정보</span>
                            </div>
                            {/** 도표 영역 */}
                            <div className="table">
                                <div className="table-row">
                                    <div className="table-cell p-2 bg-gray-100 border-b border-gray-500">
                                        <span>HAWB 번호</span>
                                    </div>
                                    <div className="table-cell p-2 border-b border-gray-500">
                                        <span>98049389324</span>
                                    </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell p-2 bg-gray-100 border-b border-gray-500">
                                        <span>Invoice 번호</span>
                                    </div>
                                    <div className="table-cell p-2 border-b border-gray-500">
                                        <span>123123</span>
                                    </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell p-2 bg-gray-100 border-b border-gray-500">
                                        <span>DTD/FH 구분</span>
                                    </div>
                                    <div className="table-cell p-2 border-b border-gray-500">
                                        <span>DTD</span>
                                    </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell p-2 bg-gray-100 border-b border-gray-500">
                                        <span>수량</span>
                                    </div>
                                    <div className="table-cell p-2 border-b border-gray-500">
                                        <span>1</span>
                                    </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell p-2 bg-gray-100 border-b border-gray-500">
                                        <span>중량</span>
                                    </div>
                                    <div className="table-cell p-2 border-b border-gray-500">
                                        <span>2</span>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                    {/** 두번째 영역 */}
                    <div className="flex flex-col flex-grow">
                        {/** 제목 영역 */}
                        <div className="border-b-2 border-black mb-5">
                            <span className="text-lg">운송요청정보</span>
                        </div>
                        {/** 상차지 정보 */}
                        <div className="table mb-5">
                            {/** 소제목 */}
                            <div className="mb-2">
                                <span className="font-bold">상차지 정보</span>
                            </div>
                            {/** column */}
                            <div className="table-row">
                                <div className="table-cell bg-gray-100 border-y border-gray-500">
                                    <span>상차지명</span>
                                </div>
                                <div className="table-cell bg-gray-100 border-y border-gray-500">
                                    <span>납품서류 여부</span>
                                </div>
                                <div className="table-cell bg-gray-100 border-y border-gray-500">
                                    <span>정시배송 여부</span>
                                </div>
                            </div>
                            {/** data */}
                            <div className="table-row">
                                <div className="table-cell">
                                    <span>KWE</span>
                                </div>
                                <div className="table-cell">
                                    <span>Y</span>
                                </div>
                                <div className="table-cell">
                                    <span>Y</span>
                                </div>
                            </div>
                        </div>
                        {/** 하차지 정보 */}
                        <div className="table mb-5">
                            {/** 소제목 */}
                            <div className="mb-2">
                                <span className="font-bold">하차지 정보</span>
                            </div>
                            {/** column */}
                            <div className="table-row">
                                <div className="table-cell bg-gray-100 border-y border-gray-500">
                                    <span>하차지명</span>
                                </div>
                                <div className="table-cell bg-gray-100 border-y border-gray-500">
                                    <span>하차지 담당자</span>
                                </div>
                                <div className="table-cell bg-gray-100 border-y border-gray-500">
                                    <span>전화번호</span>
                                </div>
                                <div className="table-cell bg-gray-100 border-y border-gray-500">
                                    <span>핸드폰번호</span>
                                </div>
                            </div>
                            {/** data */}
                            <div className="table-row">
                                <div className="table-cell">
                                    <span>한국에스엠씨 주식회사 대전</span>
                                </div>
                                <div className="table-cell">
                                    <span>김지광</span>
                                </div>
                                <div className="table-cell">
                                    <span>010-4313-4335</span>
                                </div>
                                <div className="table-cell">
                                    <span>010-4313-4335</span>
                                </div>
                            </div>
                        </div>
                        {/** 운송사 / 배차 정보 */}
                        <div className="table mb-5">
                            {/** 소제목 */}
                            <div className="mb-2">
                                <span className="font-bold">운송사 / 배차 정보</span>
                            </div>
                            {/** column */}
                            <div className="table-row">
                                <div className="table-cell bg-gray-100 border-y border-gray-500">
                                    <span>운송사</span>
                                </div>
                                <div className="table-cell bg-gray-100 border-y border-gray-500">
                                    <span>운송사 연락처</span>
                                </div>
                                <div className="table-cell bg-gray-100 border-y border-gray-500">
                                    <span>운송사 담당자</span>
                                </div>
                                <div className="table-cell bg-gray-100 border-y border-gray-500">
                                    <span>담당자 이메일</span>
                                </div>
                                <div className="table-cell bg-gray-100 border-y border-gray-500">
                                    <span>차량종류</span>
                                </div>
                            </div>
                            {/** data */}
                            <div className="table-row">
                                <div className="table-cell">
                                    <span>원더로지스 주식회사</span>
                                </div>
                                <div className="table-cell">
                                    <span>010-3369-6473</span>
                                </div>
                                <div className="table-cell">
                                    <span>신인중</span>
                                </div>
                                <div className="table-cell">
                                    <span>ijshin@wonderlogis.co.kr</span>
                                </div>
                                <div className="table-cell">
                                    <span>일반</span>
                                </div>
                            </div>
                        </div>
                        {/** 세번째 영역 */}
                        <div className="flex flex-col flex-grow">
                            {/** 제목 영역 */}
                            <div className="border-b-2 border-black mb-5">
                                <span className="text-lg">KWE 업무담당자정보</span>
                            </div>
                            {/** 상차지 정보 */}
                            <div className="table mb-5">
                                {/** column */}
                                <div className="table-row">
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>상차지명</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>납품서류 여부</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>정시배송 여부</span>
                                    </div>
                                </div>
                                {/** data */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <span>KWE</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>Y</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>Y</span>
                                    </div>
                                </div>
                            </div>
                            {/** 하차지 정보 */}
                            <div className="table mb-5">
                                {/** 소제목 */}
                                <div className="mb-2">
                                    <span className="font-bold">하차지 정보</span>
                                </div>
                                {/** column */}
                                <div className="table-row">
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>하차지명</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>하차지 담당자</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>전화번호</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>핸드폰번호</span>
                                    </div>
                                </div>
                                {/** data */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <span>한국에스엠씨 주식회사 대전</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>김지광</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>010-4313-4335</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>010-4313-4335</span>
                                    </div>
                                </div>
                            </div>
                            {/** 운송사 / 배차 정보 */}
                            <div className="table mb-5">
                                {/** 소제목 */}
                                <div className="mb-2">
                                    <span className="font-bold">운송사 / 배차 정보</span>
                                </div>
                                {/** column */}
                                <div className="table-row">
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>운송사</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>운송사 연락처</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>운송사 담당자</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>담당자 이메일</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>차량종류</span>
                                    </div>
                                </div>
                                {/** data */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <span>원더로지스 주식회사</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>010-3369-6473</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>신인중</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>ijshin@wonderlogis.co.kr</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>일반</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/** 네번째 영역 */}
                        <div className="flex flex-col flex-grow">
                            {/** 제목 영역 */}
                            <div className="border-b-2 border-black mb-5">
                                <span className="text-lg">통관진행정보</span>
                            </div>
                            {/** 상차지 정보 */}
                            <div className="table mb-5">
                                {/** column */}
                                <div className="table-row">
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>상차지명</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>납품서류 여부</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>정시배송 여부</span>
                                    </div>
                                </div>
                                {/** data */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <span>KWE</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>Y</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>Y</span>
                                    </div>
                                </div>
                            </div>
                            {/** 하차지 정보 */}
                            <div className="table mb-5">
                                {/** 소제목 */}
                                <div className="mb-2">
                                    <span className="font-bold">하차지 정보</span>
                                </div>
                                {/** column */}
                                <div className="table-row">
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>하차지명</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>하차지 담당자</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>전화번호</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>핸드폰번호</span>
                                    </div>
                                </div>
                                {/** data */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <span>한국에스엠씨 주식회사 대전</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>김지광</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>010-4313-4335</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>010-4313-4335</span>
                                    </div>
                                </div>
                            </div>
                            {/** 운송사 / 배차 정보 */}
                            <div className="table mb-5">
                                {/** 소제목 */}
                                <div className="mb-2">
                                    <span className="font-bold">운송사 / 배차 정보</span>
                                </div>
                                {/** column */}
                                <div className="table-row">
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>운송사</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>운송사 연락처</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>운송사 담당자</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>담당자 이메일</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>차량종류</span>
                                    </div>
                                </div>
                                {/** data */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <span>원더로지스 주식회사</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>010-3369-6473</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>신인중</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>ijshin@wonderlogis.co.kr</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>일반</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/** 다섯번째 영역 */}
                        <div className="flex flex-col flex-grow">
                            {/** 제목 영역 */}
                            <div className="border-b-2 border-black mb-5">
                                <span className="text-lg">운송현황</span>
                            </div>
                            {/** 상차지 정보 */}
                            <div className="table mb-5">
                                {/** column */}
                                <div className="table-row">
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>상차지명</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>납품서류 여부</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>정시배송 여부</span>
                                    </div>
                                </div>
                                {/** data */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <span>KWE</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>Y</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>Y</span>
                                    </div>
                                </div>
                            </div>
                            {/** 하차지 정보 */}
                            <div className="table mb-5">
                                {/** 소제목 */}
                                <div className="mb-2">
                                    <span className="font-bold">하차지 정보</span>
                                </div>
                                {/** column */}
                                <div className="table-row">
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>하차지명</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>하차지 담당자</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>전화번호</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>핸드폰번호</span>
                                    </div>
                                </div>
                                {/** data */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <span>한국에스엠씨 주식회사 대전</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>김지광</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>010-4313-4335</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>010-4313-4335</span>
                                    </div>
                                </div>
                            </div>
                            {/** 운송사 / 배차 정보 */}
                            <div className="table mb-5">
                                {/** 소제목 */}
                                <div className="mb-2">
                                    <span className="font-bold">운송사 / 배차 정보</span>
                                </div>
                                {/** column */}
                                <div className="table-row">
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>운송사</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>운송사 연락처</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>운송사 담당자</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>담당자 이메일</span>
                                    </div>
                                    <div className="table-cell bg-gray-100 border-y border-gray-500">
                                        <span>차량종류</span>
                                    </div>
                                </div>
                                {/** data */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <span>원더로지스 주식회사</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>010-3369-6473</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>신인중</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>ijshin@wonderlogis.co.kr</span>
                                    </div>
                                    <div className="table-cell">
                                        <span>일반</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </DialogBasic>
    );
}

export default Popup;