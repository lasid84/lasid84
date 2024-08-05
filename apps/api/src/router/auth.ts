import { Router } from "express";

import * as auth from "../components/auth/auth";

/**
 * @dev
 * Routing file for related to Auth API
 */

export default function setUpAuthRoutes(routes: Router) {
  routes.post("/login", auth.login);
  routes.get("/logout", auth.logout);
}
