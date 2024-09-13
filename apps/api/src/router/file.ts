import { Router } from "express";

import * as file from "../components/file/file"

export default function setUpFileRoutes(routes: Router) {
    // File upload to server.
    routes.post("/file-upload", file.fileUpload)

    // Booking Report File Download.
    routes.post("/report-download", file.reportDownload);

    // Booking Report Template File Upload.
    routes.post("/template-upload", file.reportUpload);
  }