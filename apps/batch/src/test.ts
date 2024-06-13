const Library = require('../components/ufspLibrary/ufsLibray');

const ufsp = new Library({workerData: { idx: 11, pgm:'SCRAP_UFSP_HBL', type:'E', isHeadless:false}});


const exe = async () => {
    await ufsp.startBrowser();
    await ufsp.loginByApi('stephen.lim');
}

exe();