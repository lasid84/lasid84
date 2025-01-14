import { getConnector } from '../connectors';
import mysql, { RowDataPacket } from 'mysql2/promise';
import { DBConnector } from '../connectors/baseConnector';

import { log, ProcedureResult } from '@repo/kwe-lib-new';
import { fileURLToPath } from 'url';

//https://dev.mysql.com/doc/dev/mysql-server/latest/#column-type
const typeMapping: { [key: number]: string } = {
  0: 'decimal',
  1: 'tiny',
  2: 'short',
  3: 'long',
  4: 'float',
  5: 'double',
  6: 'null',
  7: 'timestamp',
  8: 'longlong',
  9: 'int24',
  10: 'date',
  11: 'time',
  12: 'datetime',
  13: 'year',
  14: 'newdate',
  15: 'varchar',
  16: 'bit',
  253: 'varchar', //'var_string', // varchar과 동일
  254: 'string',
  // 추가 매핑 필요 시 여기에 추가
};

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
  paramList: any[] = [],
  valueList: any[] = [],
): Promise<ProcedureResult> {

  const connector = getConnector('mysql', connStr);

  try {
    await connector.query('BEGIN');

    const [schema, procName] = procedureName.includes('.')
              ? procedureName.split('.') : ['public', procedureName];
    let resultArgument = await checkExistsProcedure(connector, schema, procName, paramList.toString());

    if (resultArgument.numericData != 0)
        return resultArgument;

    const query = generateProcedureQuery(schema, procName, valueList);

    const [rows, fields] = await connector.query<RowDataPacket[]>(query, valueList);

    const tables = [];
    for (let i = 0; i < rows.length; i++) {
      if (!fields[i]) continue;

      const field = (fields[i]).map((fieldRow: { name: string, type: number }, fieldIndex: number) => {        
        return {
          name: fieldRow.name.toLowerCase(),
          columnID: fieldIndex + 1,
          format: typeMapping[fieldRow.type] || 'unknown'
        };
      });

      const table = {
        data: rows[i],
        fields: field,
      }
      tables.push(table);
    }
    
    const [outParamResult] = await connector.query<RowDataPacket[]>(
      'SELECT @n_return AS n_return, @v_return AS v_return'
    );
    
    const result: ProcedureResult = {
        numericData: outParamResult[0].n_return as number,
        textData: outParamResult[0].v_return as string,
        cursorData: tables
    };

    connector.query('COMMIT');

    return result;

  } catch (err) {
    await connector.query('ROLLBACK');
    return {
        numericData: -1,
        textData: JSON.stringify(err),
    };
  } finally {

  }
}

const checkExistsProcedure = async (connector: DBConnector, schema: string, procName:string, paramList:string)
: Promise<ProcedureResult> => {
    try {
        const query = 'CALL P_GET_ARGUMENTS(?, ?, ?, ?, @n_return, @v_return)';
        const varyingParams = [
          schema,
          procName,
          "1",
          'O'
        ];
        // OUT 변수 선언 및 초기화
        await connector.query('SET @n_return = NULL;');
        await connector.query('SET @v_return = NULL;');
        const [cursorResult] = await connector.query<RowDataPacket[]>(query, varyingParams);

        const [result] = await connector.query<RowDataPacket[]>(
          'SELECT @n_return AS n_return, @v_return AS v_return'
        );
        
        const procedureResult: ProcedureResult = {
            numericData: result[0].n_return as number,
            textData: result[0].v_return as string,
            cursorData: cursorResult[0] as any,
        };

        if (procedureResult.numericData != 0) {
            return procedureResult;
        }

        return procedureResult;
    } catch (err) {
        await connector.query('ROLLBACK');
        return {
            numericData: -1,
            textData: JSON.stringify(err),
        };
    } finally {
        
    }
}

const generateProcedureQuery = (schema: string, procName: string, valueList: any[]): string => {
  const placeholders = valueList.map((_, index) => '?').join(', ');
  return `call ${schema}.${procName}(${placeholders},@n_retrun,@v_return);`;
}