import { Router } from 'express';

import * as data from '../components/data/data'

/**
 * @dev
 * Routing file for related to Check API
 */

export default function setUpDataRoutes(routes : Router) {
    routes.post("/data", data.getData);
    routes.get("/limo/data", data.getLimoData);
}