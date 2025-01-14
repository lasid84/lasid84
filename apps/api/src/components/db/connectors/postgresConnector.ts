import pg from 'pg';
import { DBConnector } from './baseConnector';
import { log } from '@repo/kwe-lib-new';

const { Pool } = pg;

export class PostgreSQLConnector extends DBConnector {
  private static instance: PostgreSQLConnector;
  private pool: any;

  private constructor(connStr: string, options = {}) {
    super(); // 부모 클래스의 생성자 호출
    this.pool = new Pool({
      connectionString: connStr,
      statement_timeout: 30000, // 30초
      ...options,
    });
  }

  public static getInstance(connStr: string, options = {}): PostgreSQLConnector {
    if (!PostgreSQLConnector.instance) {
      PostgreSQLConnector.instance = new PostgreSQLConnector(connStr, options);
    }
    return PostgreSQLConnector.instance;
  }

  async connect(): Promise<void> {
    log('PostgreSQL connection pool initialized');
  }

  // 클라이언트를 반환하는 메서드
  async getClient(): Promise<any> {
    return await this.pool.connect();
  }

  async query<T>(sql: string, params?: any[]): Promise<T> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(sql, params);
      return result as T;
    } finally {
      client.release();
    }
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
  }
}
