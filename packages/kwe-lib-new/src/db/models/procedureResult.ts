import { QueryResult, QueryResultRow, } from "pg";

/**
 * @description
 * 모델 정의: 프로시저 반환값
 */
export interface ProcedureResult {
    /** 숫자 값 */
    n_return: number;
  
    /** 문자열 값 */
    v_return: string;

    /** 커서 값 */
    c_return?: Array<{
      data: QueryResultRow[];       // PostgreSQL 쿼리 결과 행 배열
      fields: Record<string, any>[]; // 필드 메타데이터 배열
    }>;
  }
  