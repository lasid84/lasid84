export const AuthRoutes = {
    BASE : "/auth",
    URI : {
        LOGIN: "/login",
        LOGOUT: "/logout"
    }
};

export const CheckRoutes = {
    BASE : "/check",
    URI : {
        GET_MESSAGE_NAME: "/message/",
        GET_STATUS: "/status"
    }
};

export const DataRoutes = {
    BASE : "/api",
    URI : {
        GET_DATA: "/data",
        GET_TMSDATA: "/data/tms",
        GET_LIMO_DATA: "/limo/data",
        GET_CARG_CSCL_PRGS_INFO_QRY: "/external/k-customs/getCargCsclPrgsInfoQry",  //유니패스 화물통관진행정보
        HEALTH_CHECK: "/external/k-customs/healthcheck",
        SEND_MAIL: "/mailing",
        GET_DESCARTES_CUSTOMS_INFO: "/external/descartes/customsinfo"
    }
};

export const FileRoutes = {
    BASE : "/file",
    URI : {
        REPORT_DOWNLOAD: "/report-download",
        REPORT_UPLOAD: "/template-upload",

        FILE_UPLOAD: "/file-upload"
    }
}
