import { log, error } from '@';

export const getMenuParameters = (params: string) => {
    if (!params) return '';
    
    const objParam: any = {};
    for (const param of params.split(';')) {
        const [key, val] = param.split('=');
        objParam[key] = val;
    }
    // log("getMenuParameters", objParam);

    return objParam;
}
