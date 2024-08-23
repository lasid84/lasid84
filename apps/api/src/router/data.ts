import { Router } from "express";

import * as data from "../components/data/data";
import * as unipass from "../components/data/k-customs"

/**
 * @dev
 * Routing file for related to Check API
 */

export default function setUpDataRoutes(routes: Router) {
  routes.post("/data", data.getData);
  routes.post("/limo/data", data.getLimoData);
  routes.post("/external/k-customs/getCargCsclPrgsInfoQry", unipass.getCargCsclPrgsInfoQry);
  routes.post("/external/k-customs/healthcheck", unipass.healthcheck);
}
