import { StatusCodes } from 'http-status-codes';

/**
 * @dev
 * Routing file for related to Check(Test) API
 */

export const healthCheck = (req, res) => {
    return res.status(StatusCodes.OK).json("health");
}