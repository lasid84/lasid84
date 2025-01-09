import mysql from 'mysql2/promise';
import { DBConnector } from './baseConnector';

export class MySQLConnector extends DBConnector {
  private static instance: MySQLConnector;
  private pool: mysql.Pool;

  private constructor(connStr: string, options = {}) {
    super(); // 부모 클래스의 생성자 호출
    this.pool = mysql.createPool({
      uri: connStr,
      connectionLimit: 10,
      ...options,
    });
  }

  public static getInstance(connStr: string, options = {}): MySQLConnector {
    if (!MySQLConnector.instance) {
      MySQLConnector.instance = new MySQLConnector(connStr, options);
    }
    return MySQLConnector.instance;
  }

  async connect(): Promise<void> {
    console.log('MySQL connection pool initialized');
  }

  async query<T>(sql: string, params?: any[]): Promise<T> {
    const rows = await this.pool.query<mysql.RowDataPacket[] | mysql.ResultSetHeader>(sql, params);
    return rows as T; // 반환값을 명시적으로 T로 캐스팅
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
  }
}
