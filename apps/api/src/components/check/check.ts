import { Request, Response } from "express";

/**
 * @dev
 * Routing file for related to Check(Test) API
 */

export const getMessageName = (req: Request, res: Response) => {
  return res.json({ meesage: `hello ${req.params.name}` });
};

export const getStatus = (_, res: Response) => {
  return res.json({ ok: true });
};
