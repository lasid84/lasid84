const Library = require('../components/ufspLibrary/ufsLibray');

const ufsp = new Library({workerData: { idx: 11, pgm:'SCRAP_UFSP_HBL', type:'E', isHeadless:false}});
const { signJwtAccessToken } = require('@repo/kwe-lib/components/jsonWebToken.js');
const { init, dataCall } = require('@repo/kwe-lib/components/api.service.js');

// const Library = require('../ufspLibrary/ufsLibray');

// const ufsp = new Library(workerData);

const exe = async () => {
    var token = signJwtAccessToken({user_id:"sdd_it", user_nm:"SDD"});
    const client = await init({url:'http://localhost:5005', isAuth:false, accessToken:token});

    const inparam = ['in_pgm_code', 'in_user_id', 'in_ipaddr'];
    const invalue = ['SCRAP_UFSP_PROFILE_CUSTOMER', '', ''];
    const inproc = 'scrap.f_scrp0002_get_script_api'; 
        
    const { cursorData, numericData, textData } = await dataCall(client, inproc,inparam, invalue,'');
    console.log(cursorData, numericData, textData);
}

exe();