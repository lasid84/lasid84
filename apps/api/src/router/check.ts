import { Router } from 'express';

import * as check from '../components/check/check'

/**
 * @dev
 * Routing file for related to Check API
 */

export default function setUpCheckRoutes(routes : Router) {
    routes.get("/message/:name", check.getMessageName);
    routes.get("/status", check.getStatus);
}