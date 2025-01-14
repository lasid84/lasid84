/**
 * @description
 * 모델 정의: 프로시저 반환값
 */
export interface ProcedureResult {
    /** 숫자 값 */
    numericData: number;
  
    /** 문자열 값 */
    textData: string;

    /** 커서 값 */
    cursorData?: Array<{
      data: Record<string, any>[];       // PostgreSQL 쿼리 결과 행 배열
      fields: Record<string, any>[]; // 필드 메타데이터 배열
    }>;
  }
  