import { PostgreSQLConnector } from './postgresConnector';
import { MySQLConnector } from './mysqlConnector';
import { DBConnector } from './baseConnector';

export const getConnector = (type: 'postgresql' | 'mysql', connStr: any, options={}): DBConnector => {
  if (type === 'postgresql') {
    return PostgreSQLConnector.getInstance(connStr, options);
  } else if (type === 'mysql') {
    return MySQLConnector.getInstance(connStr, options);
  } else {
    throw new Error(`Unsupported database type: ${type}`);
  }
};
