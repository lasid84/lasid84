import { Request, Response, NextFunction } from "express";

const filteredWord: string[] = ["password"];
const JSONArrayList: string[] = ["Request", "Response", "Error"];

const colors = {
  red: "\x1b[31m",
  blue: "\x1b[34m",
  end: "\x1b[0m",
};

const logLevelColorMap = {
  INFO: colors.blue,
  ERROR: colors.red,
};

const logLevel = {
  INFO: "INFO",
  ERROR: "ERROR",
};

type logger = {
  Protocol: string;
  IP: string;
  BaseURL: string;
  Method: string;
  HostName: string;
  Params?: string;
  Request?: string;
  Response?: string;
  EnterTime?: string;
  ElapsedTime?: number;
  StatusCode?: number;
  Query?: string;
  Error?: string;
  Authorization?: string;
};

export default function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const EnterTime = Date.now();
  const method: string = `${req.method}`;

  /**
   * @dev
   * Setting Basically Log Data.
   */
  let logger: logger = {
    Protocol: `${req.protocol}`,
    IP: `${req.ip}`,
    BaseURL: `${req.originalUrl}`,
    Method: method,
    HostName: `${req.hostname}`,
    EnterTime: DatetoFullString(new Date(EnterTime)),
  };

  /**
   * @dev
   * Check Request Query String.
   */
  const query: string = `${JSON.stringify(req.query)}`;
  if (query !== "{}") {
    logger.Query = query;
  }

  /**
   * @dev
   * Check Request Path Parameter.
   */
  const params: string = `${JSON.stringify(req.params)}`;
  if (params !== "{}") {
    logger.Params = params;
  }

  /**
   * @dev
   * Check JWT Token
   */
  const authorization: string = `${req.get("authorization")}`;
  if (process.env.NODE_ENV === "production") {
    logger.Authorization = "*";
  } else if (authorization !== "undefined") {
    logger.Authorization = authorization;
  }

  /**
   * @dev
   * Include Request Body When HTTP Method is not GET.
   */
  if (method !== "GET") {
    logger.Request = "[" + `${JSON.stringify(req.body)}` + "]";
  }

  /**
   * @dev
   * Include Response Data.
   * [1] Request Log Data Setting -> [2] API Enter -> [3] API Out -> [4] Response Log Data Setting -> [5] Data Logging.
   */
  try {
    const response = res.json;
    res.json = (data) => {
      const statusCode = res.statusCode;
      logger.StatusCode = statusCode;
      if (data !== undefined) {
        /**
         * @dev
         * If the server environment is "production", the credential value should be masking.
         */
        if (process.env.NODE_ENV === "production") {
          for (const word of filteredWord) {
            const filterKey = Object.keys(data).find(
              (value) => value.toLocaleLowerCase() === word
            );
            if (filterKey) {
              data[filterKey] = "*";
            }
          }
        }

        /**
         * @dev
         * According to Response StatusCode, Logging level will be decided.
         */
        if (statusCode === 200) {
          logger.Response = "[" + `${JSON.stringify(data)}` + "]";
        } else {
          logger.Error = "[" + `${JSON.stringify(data)}` + "]";
        }
      }
      res.json = response;
      return response.call(res, data);
    };

    next();

    /**
     * @dev
     * Calculate API Elasped Time.
     */
    const ExitTime = Date.now();
    logger.ElapsedTime = (ExitTime - EnterTime) / 1000;

    /**
     * @dev
     * Formatting Log Message
     */

    const entries = Object.entries(logger);
    const logFormatter = entries
      .map(([key, value]) => {
        if (JSONArrayList.includes(key)) {
          return `\"${key}\":${value}`;
        } else {
          return `\"${key}\":\"${value}\"`;
        }
      })
      .join(",");

    if (logger.Error === undefined) {
      console.info(LogFormat(logLevel.INFO, logger, logFormatter));
    } else {
      console.error(LogFormat(logLevel.ERROR, logger, logFormatter));
    }
  } catch (error) {
    console.error(LogFormat(logLevel.ERROR) + "[" + error + "]");
  }
}

/**
 * @dev
 * Formatting for API Enter Time.(Unix to yyyy-mm-dd hh:mm:ss)
 */
function DatetoFullString(value: Date): string {
  if (value) {
    const year: string = value.getFullYear().toString();
    const month: string = (value.getMonth() + 1).toString().padStart(2, "0");
    const date: string = value.getDate().toString().padStart(2, "0");
    const hour: string = value.getHours().toString().padStart(2, "0");
    const minute: string = value.getMinutes().toString().padStart(2, "0");
    const second: string = value.getSeconds().toString().padStart(2, "0");
    const milliSecond: string = value.getMilliseconds().toString();

    const matrix: string[] = [
      [year, month, date].join("-"),
      [hour, minute, second, milliSecond].join(":"),
    ];

    return matrix.join(" ");
  }
}

function LogFormat(value: string, object?: logger, formatter?: string): string {
  if (object !== undefined) {
    return (
      `${logLevelColorMap[value]}${value}${colors.end} [` +
      `${object.EnterTime}` +
      "] " +
      `{${formatter}}`
    );
  } else {
    return `${logLevelColorMap[value]}${value}${colors.end}`;
  }
}
