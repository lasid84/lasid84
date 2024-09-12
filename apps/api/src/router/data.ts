import { Router } from "express";

import * as data from "../components/data/data";
import * as unipass from "../components/data/k-customs"
import * as mailing from "../components/mailing/mailer"
import * as file from "../components/data/file";

/**
 * @dev
 * Routing file for related to Check API
 */

export default function setUpDataRoutes(routes: Router) {
  routes.post("/data", data.getData);
  routes.post("/limo/data", data.getLimoData);
  
  // 관세청 Unipass
  routes.post("/external/k-customs/getCargCsclPrgsInfoQry", unipass.getCargCsclPrgsInfoQry);  //화물통관 진행정보

  routes.get("/external/k-customs/healthcheck", unipass.healthcheck);
    
  // 메일 발송
  routes.post("/mailing", mailing.sendMail);

  // Booking Report File Download.
  routes.post("/report-download", file.fileDownload);
  // Booking Report Template File Upload.
  routes.post("/template-upload", file.fileUpload);
}
