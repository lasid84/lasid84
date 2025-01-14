import mysql from 'mysql2/promise';
import { DBConnector } from './baseConnector';
import { log } from '@repo/kwe-lib-new';

export class MySQLConnector extends DBConnector {
  
  private static instance: MySQLConnector;
  private pool: mysql.Pool;

  private constructor(connStr: string, options = {}) {
    super(); // 부모 클래스의 생성자 호출
    this.pool = mysql.createPool({
      uri: connStr,
      connectionLimit: 10,
      typeCast: (field, next) => {
        if (field.type === 'VAR_STRING' || field.type === 'STRING') {
          return field.string(); // 문자열 반환
        }
        if (field.type === 'TINY' || field.type === 'SHORT' || field.type === 'LONG') {
          const value = field.string();
          return value === null ? null : Number(value); // 숫자로 변환
        }
        return next(); // 기본 변환 사용
      },
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
    log('MySQL connection pool initialized');
  }

  async getClient(): Promise<any> {
    return await this.pool.getConnection();
  }

  async query(sql: string, params?: any[]): Promise<any> {
    const rows = await this.pool.query(sql, params);
    
    return rows;
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
  }
}
