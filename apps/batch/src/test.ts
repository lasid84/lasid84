// import { json } from "body-parser";

const Library = require('../components/ufspLibrary/ufsLibray');

const ufsp = new Library({workerData: { idx: 11, pgm:'SCRAP_UFSP_HBL', type:'E', isHeadless:false}});
const { signJwtAccessToken } = require('@repo/kwe-lib/components/jsonWebToken.js');
const { init, dataCall } = require('@repo/kwe-lib/components/api.service.js');
const { stringToDate, stringToDateString } = require('@repo/kwe-lib/components/dataFormatter');

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


    //       const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //       const monthIndex = date.getMonth();
    //       const monthName = monthNames[monthIndex];
        
    //     console.log(monthIndex, date)

    //       // 변환된 날짜 문자열 생성
    //     //   const transformedDateString = `${date.getDate().toString().padStart(2, '0')}${symbol}${monthName}${symbol}${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        
    //     //   return transformedDateString;

    // const dd = '07/23/2024 15:48:31';

    // // const regex = /^\d{2}[-\/][a-zA-Z]{3}[-\/]\d{4}\s\d{2}:\d{2}:\d{2}$/;
    // var regex = /^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}$/;
        
    //     if (!regex.test(dd)) {
    //         console.log("fase")
    //       return false;
    //     }

    //     console.log("suu")

    //     // 날짜 객체 생성
    //     const date = new Date(dd);
      
    //     // // 유효성 검사 (NaN 체크)
    //     // if (isNaN(date.getTime())) {
    //     //   return false;
    //     // }

    //     if (!(date instanceof Date) || isNaN(date.getTime())) {
    //       console.log("false")
    //         return false;
    //     }
      
    //     console.log("suu")


    //     // if (!this.isValidDate(dateString)) {
    //     //   return null;
    //     // }
            
    //     const symbol = '-';
    //     // 월 이름 변환
    //     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //     const monthIndex = date.getMonth();
    //     const monthName = monthNames[monthIndex];
      
    //     // 변환된 날짜 문자열 생성
    //     const transformedDateString = `${date.getDate().toString().padStart(2, '0')}${symbol}${monthName}${symbol}${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
      
    //     console.log(transformedDateString)

    //     // 유효한 날짜 문자열
    //     return true;

//     // const date = stringToDate('20240723')
//     const date = stringToDateString('20240723','-')
//     // const date = new Date('2024-07-23');

//     console.log(date);
    // const obj = {"seq":"ex", "invoice Date":'20230404'};

    // const arrJson = [{"Seq":"ex","Invoice Date":"인보이스 날짜","Waybill Amount":"Invoice Amount와 다를 경우만 기재"},{"BL No":550141395192,"Invoice Date":"20240723","Terms":"Prepaid","Charge Code":"TRCKNGAB","Actual Cost":99,"Cost Curr":"KRW","Vendor ID":30261418,"Billto ID":30261418},{"BL No":550141395192,"Invoice Date":"20240723","Terms":"Prepaid","Charge Code":"WHARFRV","Waybill Amount":99,"Waybill Curr":"KRW","Invoice Curr":"KRW","Billto ID":30261418},{"BL No":550141527853,"Invoice Date":"20240724","Terms":"Prepaid","Charge Code":"TRCKNGAB","Actual Cost":999,"Cost Curr":"KRW","Vendor ID":5501,"Billto ID":5800},{"BL No":550141527853,"Invoice Date":"20240724","Terms":"Prepaid","Charge Code":"WHARFRV","Waybill Amount":999,"Waybill Curr":"krw","Invoice Curr":"krw"},{"BL No":550141527853,"Invoice Date":"20240724","Terms":"Prepaid","Charge Code":"PORTSCRTRV","Waybill Amount":999,"Waybill Curr":"krw","Invoice Amount":999,"Invoice Curr":"krw"},{"BL No":550112948584,"Invoice Date":"20240725","Terms":"Prepaid","Charge Code":"pickab","Actual Cost":2,"Cost Curr":"krw","Vendor ID":302254094,"Billto ID":202254094},{"BL No":550112948584,"Invoice Date":"20240723","Terms":"Prepaid","Charge Code":"pickab","Actual Cost":2,"Cost Curr":"krw","Vendor ID":302254094,"Billto ID":202254094}]
    // // console.log(Object.entries(obj));

    

    //     const data = {
    //       "data":[],
    //       "fields":[]
    //     };
      
    //     arrJson.forEach((obj, i) => {
    //       Object.entries(obj).forEach(([key,val],j) => {
          
    //         let objData = data.data[i];
    //         objData
    //         if (i < headerLine) {
    //           let obj = data.fields[j];
    //           obj["name"] = obj["name"] ? obj["name"] + "\n" + key : obj["name"];
    //         }
      
    //       //   let objData = data.data[j];
    //       //   objData
    //       });
    //     });
      
    //     return data;
    
    }

exe();