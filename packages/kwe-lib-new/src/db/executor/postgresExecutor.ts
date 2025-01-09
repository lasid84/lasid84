import pkg from 'pg';
import { QueryResult, QueryResultRow } from 'pg';
import { getConnector } from '../connectors';
import { DBConnector } from '../connectors/baseConnector';
import { ProcedureResult } from '../models';
import { log } from '@';

/**
 * @description
 * PostgreSQL 프로시저 호출 공통 함수
 * @param connStr - DB 연결 문자열
 * @param procedureName - 호출할 프로시저 또는 함수 이름
 * @param paramList - 프로시저에 전달할 파라미터 명 배열
 * @param valueList - 프로시저에 전달할 파라미터 값 배열
 * @returns Promise<T[]>
 */
export const callPostgresProcedure = async (
    connStr: string,
    procedureName: string,
    paramList: any[] = [],
    valueList: any[] = [],
): Promise<ProcedureResult> => {

    const connector: DBConnector = getConnector('postgresql', connStr);
    try {
        const [schema, procName] = procedureName.includes('.')
            ? procedureName.split('.') : ['public', procedureName];

        await connector.query('BEGIN');
        let resultArgument = await checkExistsProcedure(connector, schema, procName, paramList.toString());
        
        log("resultArgument", resultArgument.c_return);
        
        if (resultArgument.n_return !== 0)
            return resultArgument;

        const query = generateProcedureQuery(schema, procName, valueList);
        const { rows } = await connector.query<QueryResult<QueryResultRow>>(query, valueList);

        const result: ProcedureResult = {
            n_return: 0,
            v_return: '',
        }
        
        for (const row of resultArgument.c_return?.[0].data ?? []) {
            const paramName = row['parameter_name'] as string;
            const outParamValue = rows[0][paramName];

            switch (row['data_type']) {
                case 'integer':
                    result.n_return = outParamValue as number;
                    break;
                case 'text':
                    result.v_return = outParamValue as string;
                    break;
                case 'refcursor':
                    if (outParamValue) {

                        const fetchAllQuery = `FETCH ALL FROM "${outParamValue}";`;
                        const cursorResult  = await connector.query<QueryResult>(fetchAllQuery);
                        
                        if (!result.c_return) result.c_return = [];
                        result.c_return.push({ data:cursorResult.rows, fields:cursorResult.fields});

                    }
                    break;
            }
        }

        connector.query('COMMIT');
        return result;
    } catch (err) {
        await connector.query('ROLLBACK');
        return {
            n_return: -1,
            v_return: JSON.stringify(err),
        };
    } finally {
        
    };
}

const checkExistsProcedure = async (connector: DBConnector, schema: string, procName:string, paramList:string)
: Promise<ProcedureResult> => {
    try {
        const varyingParams = ['', schema, procName, paramList];    
        // Call the function with varying IN parameters and the cursor OUT parameter
        const query = 'SELECT * FROM public.f_admn_get_arguments($1, $2, $3, $4);';
        const { rows } = await connector.query<QueryResult<QueryResultRow>>(query, varyingParams);

        const procedureResult: ProcedureResult = {
            n_return: -1,
            v_return: '',
            c_return: [],
        };
        const cursorNames: string[] = [];
            
        for (const [columnName, columnValue] of Object.entries(rows[0])) {
            if (columnName.startsWith('n_return')) {
                procedureResult.n_return = columnValue as number;
            } else if (columnName.startsWith('v_return')) {
                procedureResult.v_return = columnValue as string;
            } else if (columnName.startsWith('c_return')) {
                cursorNames.push(columnValue as string);
            }
        }
        
        // Check numeric result and return if not zero
        if (procedureResult.n_return !== 0) {
            return procedureResult;
        }

        // Process cursor results
        for (const cursorName of cursorNames) {
            const fetchAllQuery = `FETCH ALL FROM "${cursorName}";`;
            const queryResult = await connector.query<QueryResult>(fetchAllQuery);

            const cursor = {
                data: queryResult.rows,
                fields: queryResult.fields,
            }
            procedureResult.c_return!.push(cursor);

            // Close the cursor after fetching
            await connector.query(`CLOSE "${cursorName}";`);
        }

        return procedureResult;
    } catch (err) {
        await connector.query('ROLLBACK');
        return {
            n_return: -1,
            v_return: JSON.stringify(err),
        };
    } finally {
        
    }
}

const generateProcedureQuery = (schema: string, procName: string, valueList: any[]): string => {
    const placeholders = valueList.map((_, index) => `$${index + 1}`).join(', ');
    return `SELECT * FROM ${schema}.${procName}(${placeholders});`;
  }


