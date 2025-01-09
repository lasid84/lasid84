import { getConnector } from '../connectors/index';
import { MySQLConnector } from '../connectors/mysqlConnector';
import mysql from 'mysql2/promise';

/**
 * @description
 * MySQL 프로시저 호출 함수
 * @param procedureName - 호출할 프로시저 이름
 * @param params - 프로시저에 전달할 파라미터 배열
 * @returns Promise<T>
 */
export async function executeMysqlProcedure(
  connStr: string,
  procedureName: string,
  params: any[]
): Promise<mysql.RowDataPacket[] | mysql.ResultSetHeader> {

  
  const placeholders = params.map(() => '?').join(', ');
  const query = `CALL ${procedureName}(${placeholders})`;

  const connector = getConnector('mysql', connStr);
  return await connector.query(query, params);
}
