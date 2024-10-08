import { useState, memo } from "react";
import Image from "next/image";

import { IoIosArrowUp } from "react-icons/io";

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

const BookmarkTab = memo(({ loadItem } : any) => {
    const [isFold, setIsFold] = useState(false);
    const [subjectIndex, setSubjectIndex] = useState(0);
  
    const onFoldButtonClick = () => {
      setIsFold(!isFold);
    };
  
    const onSubjectButtonClick = (idx : number) => {
      setSubjectIndex(idx);
    };
    
    return (
        <div className={`w-full ${isFold? 'bg-transparent' : 'bg-white'}`}>
          <div className="w-full pl-[20px] p-[5px] cursor-pointer border-b-2 border-[#E6E6E6]" style={{display: isFold? "none": "flex"}}>
            {loadItem && loadItem[0].data.map((item : any, i : number) => (
              <div key={i} className={ `relative mr-[20px] text-sm font-sans ${i === subjectIndex? 'font-black after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-[7px] after:h-[2px] after:bg-black' :  'font-medium hover:text-[#1DA072]' }` } onClick={() => onSubjectButtonClick(i)}>{item.cd_nm}</div>
            ))}
          </div>
            <Swiper spaceBetween={0} slidesPerView={9} loop={false} modules={[FreeMode]} wrapperClass={"flex flex-row"} className={`flex-row w-100 bg-white ${isFold? 'hidden' : 'flex'}`}>
            {loadItem && loadItem[1].data.filter((data : any) => data.cd_mgcd2 === loadItem[0].data[subjectIndex].cd).map((item : any, idx : number) => {
              return(
                <SwiperSlide key={idx} className="swiper-slide flex flex-col items-center py-[26px] cursor-pointer" onClick={() => window.open(item.cd, "_blank")}>
                  <div className="relative overflow-hidden w-[74px] h-[74px] flex justify-center items-center border border-[#225E75] rounded-[50%]"><Image src={"/bookmark/" + item.cd_mgcd1} alt="bookmark" width={48} height={48} /></div>
                  <div className="flex justify-center items-center mt-[1rem] text-xs text-[#696565] text-center whitespace-pre-line">{item.cd_nm.replace("\\n", "\n")}</div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="w-full flex flex-row justify-center items-center">
            <button className={`transition-transform duration-500 ${isFold? 'rotate-180' : 'rotate-0'}`} onClick={onFoldButtonClick}><IoIosArrowUp size={30}/></button>
          </div>
        </div>
    );
});

export default BookmarkTab