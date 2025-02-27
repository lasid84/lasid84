const { log, error } = require('./logHelper');

const getMenuParameters = (params) => {
    if (!params) return '';
    var objParam = {};
    for (const param of params.split(';')) {
        const [key, val] = param.split('=');
        objParam[key] = val;
    }
    // log("getMenuParameters", objParam);

    return objParam;
}

module.exports = {
    getMenuParameters
}