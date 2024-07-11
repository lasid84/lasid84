const Library = require('../components/ufspLibrary/ufsLibray');

const ufsp = new Library({workerData: { idx: 11, pgm:'SCRAP_UFSP_HBL', type:'E', isHeadless:false}});
const { signJwtAccessToken } = require('@repo/kwe-lib/components/jsonWebToken.js');
const { init, dataCall } = require('@repo/kwe-lib/components/api.service.js');

// const Library = require('../ufspLibrary/ufsLibray');

// const ufsp = new Library(workerData);

const exe = async () => {
    // var token = signJwtAccessToken({user_id:"sdd_it", user_nm:"SDD"});
    // const client = await init({url:'http://localhost:5005', isAuth:false, accessToken:token});

    // const inparam = ['in_pgm_code', 'in_user_id', 'in_ipaddr'];
    // const invalue = ['SCRAP_UFSP_PROFILE_CUSTOMER', '', ''];
    // const inproc = 'scrap.f_scrp0002_get_script_api'; 
        
    // const { cursorData, numericData, textData } = await dataCall(client, inproc,inparam, invalue,'');
    // console.log(cursorData, numericData, textData);

    // const dd = '16-Apr-2024 00:00:00';

    // const isValidDateForUFS = (dateString) => {
    //     if (!dateString) return false;
    //     // 날짜 형식 검사
    //     const regex = /^\d{2}[-\/][a-zA-Z]{3}[-\/]\d{4}\s\d{2}:\d{2}:\d{2}$/;
        
    //     if (!regex.test(dateString)) {
    //       return false;
    //     }
      
    //     // 날짜 객체 생성
    //     const date = new Date(dateString);
      
    //     // // 유효성 검사 (NaN 체크)
    //     // if (isNaN(date.getTime())) {
    //     //   return false;
    //     // }

    //     if (!(date instanceof Date) || isNaN(date.getTime())) {
    //         return false;
    //     }
      
    //     // 유효한 날짜 문자열
    //     return true;
    //   }

    //     if (!isValidDateForUFS(dd)) {
    //         console.log("false!!")
    //         return null;
    //       }
        
    //       // 날짜 객체 생성
    //       const date = new Date(dd);
        
    //     //   // 월 이름 변환
    //       const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //       const monthIndex = date.getMonth();
    //       const monthName = monthNames[monthIndex];
        
    //     console.log(monthIndex, date)

    //       // 변환된 날짜 문자열 생성
    //     //   const transformedDateString = `${date.getDate().toString().padStart(2, '0')}${symbol}${monthName}${symbol}${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        
    //     //   return transformedDateString;

    const dd = '16/04/2024';

    const regex = /^\d{2}[-\/][a-zA-Z]{3}[-\/]\d{4}\s\d{2}:\d{2}:\d{2}$/;
        
        if (!regex.test(dd)) {
            console.log("fase")
          return false;
        }

        console.log("suu")

    
}

exe();