import { QueryResult, QueryResultRow, PoolClient } from 'pg';
import { getConnector } from '../connectors';
import { DBConnector } from '../connectors/baseConnector';

import { ProcedureResult } from '@repo/kwe-lib-new';
import { log } from '@repo/kwe-lib-new';

/**
 * @description
 * PostgreSQL 프로시저 호출 공통 함수
 * @param connStr - DB 연결 문자열
 * @param procedureName - 호출할 프로시저 또는 함수 이름
 * @param paramList - 프로시저에 전달할 파라미터 명 배열
 * @param valueList - 프로시저에 전달할 파라미터 값 배열
 * @returns Promise<T[]>
 */
export const executePostgresProcedure = async (
    connStr: string,
    procedureName: string,
    paramList: any[] = [],
    valueList: any[] = [],
): Promise<ProcedureResult> => {

    const connector: DBConnector = getConnector('postgresql', connStr);
    let client: PoolClient = await connector.getClient();
    try {
        const [schema, procName] = procedureName.includes('.')
            ? procedureName.split('.') : ['public', procedureName];

        await client.query('BEGIN');
        let resultArgument = await checkExistsProcedure(client, schema, procName, paramList.toString());
                
        if (resultArgument.numericData !== 0)
            return resultArgument;

        const query = generateProcedureQuery(schema, procName, valueList);
        const { rows } = await client.query<QueryResult<QueryResultRow>>(query, valueList);

        const result: ProcedureResult = {
            numericData: 0,
            textData: '',
        }
        
        for (const row of resultArgument.cursorData?.[0].data ?? []) {
            const paramName = row['parameter_name'] as string;
            const outParamValue = rows[0][paramName as keyof QueryResult];

            switch (row['data_type']) {
                case 'integer':
                    result.numericData = outParamValue as number;
                    break;
                case 'text':
                    result.textData = outParamValue as string;
                    break;
                case 'refcursor':
                    if (outParamValue) {

                        const fetchAllQuery = `FETCH ALL FROM "${outParamValue}";`;
                        const cursorResult  = await client.query<QueryResult>(fetchAllQuery);
                        
                        if (!result.cursorData) result.cursorData = [];
                        result.cursorData.push({ data:cursorResult.rows, fields:cursorResult.fields});

                    }
                    break;
            }
        }

        client.query('COMMIT');
        
        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        return {
            numericData: -1,
            textData: JSON.stringify(err),
        };
    } finally {
        client.release();
    };
}

const checkExistsProcedure = async (client: PoolClient, schema: string, procName:string, paramList:string)
: Promise<ProcedureResult> => {
    try {
        const varyingParams = ['', schema, procName, paramList];    
        // Call the function with varying IN parameters and the cursor OUT parameter
        const query = 'SELECT * FROM public.f_admn_get_arguments($1, $2, $3, $4);';
        const { rows } = await client.query<QueryResult<QueryResultRow>>(query, varyingParams);

        const procedureResult: ProcedureResult = {
            numericData: -1,
            textData: '',
            cursorData: [],
        };
        const cursorNames: string[] = [];
            
        for (const [columnName, columnValue] of Object.entries(rows[0])) {
            if (columnName.startsWith('n_return')) {
                procedureResult.numericData = columnValue as number;
            } else if (columnName.startsWith('v_return')) {
                procedureResult.textData = columnValue as string;
            } else if (columnName.startsWith('c_return')) {
                cursorNames.push(columnValue as string);
            }
        }
        
        // Check numeric result and return if not zero
        if (procedureResult.numericData !== 0) {
            return procedureResult;
        }

        // Process cursor results
        for (const cursorName of cursorNames) {
            const fetchAllQuery = `FETCH ALL FROM "${cursorName}";`;
            const queryResult = await client.query<QueryResult>(fetchAllQuery);

            const cursor = {
                data: queryResult.rows,
                fields: queryResult.fields,
            }
            procedureResult.cursorData!.push(cursor);

            // Close the cursor after fetching
            await client.query(`CLOSE "${cursorName}";`);
        }

        return procedureResult;
    } catch (err) {
        await client.query('ROLLBACK');
        return {
            numericData: -1,
            textData: JSON.stringify(err),
        };
    } finally {
        
    }
}

const generateProcedureQuery = (schema: string, procName: string, valueList: any[]): string => {
    const placeholders = valueList.map((_, index) => `$${index + 1}`).join(', ');
    return `SELECT * FROM ${schema}.${procName}(${placeholders});`;
  }


