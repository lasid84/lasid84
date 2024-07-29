import { Express, Router } from "express";

import setUpAuthRoutes from "./auth";
import setUpCheckRoutes from "./check";

import { healthCheck } from "../components/health-check/health-check";
import setUpDataRoutes from "./data";

/**
 * @dev
 * Version Router
 */
const v1: Router = Router();

/**
 * @dev
 * Components Router
 */
const authRoutes: Router = Router();
const checkRoutes: Router = Router();
const dataRoutes: Router = Router();

/**
 * @dev
 * Main API routing module
 * 1. Version Routing
 * 2. Components Routing
 */
export default function setupRoutes(app: Express) {
  app.use("/auth", authRoutes);
  app.use("/check", checkRoutes);
  app.use("/api", dataRoutes);

  /**
   * @dev
   * Health Check API for Load Balancer
   */
  app.get("/health", healthCheck);

  /** Auth API */
  setUpAuthRoutes(authRoutes);

  /** Check API */
  setUpCheckRoutes(checkRoutes);

  /** Data API */
  setUpDataRoutes(dataRoutes);
}
