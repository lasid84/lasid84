const { dataContainer } = require('./dataContainer');
const { Client, Pool } = require('pg');
// import { log, ini, objectPath, fs } from "../src/index";
const { log } = require('./logHelper');

var pool;

async function initconnectionString() {
  // async () => {

  const ini = require("ini");
  const objectPath = require("object-path");
  const fs = require("fs").promises;
  var iniData = ini.decode(await fs.readFile(process.cwd() + "/dist/configs/server.ini", "utf8"));
  var connstr = objectPath.get(iniData, "db.connstr");

  if (!pool) {
    pool = new Pool({
      connectionString: connstr,
      statement_timeout: 30000,
    });
  }

  return connstr
}

async function callFunction(pProcName, pParamsList, pValueList) {
  // log("callFunction");
  // let startTime = performance.now();

  // const connectionString = await initconnectionString();
  // const client = new Client({ connectionString });
  
  await initconnectionString();
  // const client = await pool.connect();

  // const pool = new Pool({
  //     connectionString: connectionString,
  //     statement_timeout: 30000,
  //   });

  const client = await pool.connect();
  
  // let endTime = performance.now();
  //   let timeDiff = endTime - startTime; // 실행 시간 (밀리초)
  //   console.log(`Code execution time: ${timeDiff} milliseconds`);

  try {
    
    let schema;
    let procName;

    if (pProcName.indexOf('.') !== -1) {
        schema = pProcName.split('.')[0];
        procName = pProcName.split('.')[1];
      }
      else {
        schema = 'public';
        procName = pProcName;
      }

    // log("1.", pProcName, pParamsList, pValueList);

    const strParam = pParamsList.toString();
    const resultArgument = await getArgument(client, schema, procName, strParam);

    // log("1.5", schema, procName, strParam, resultArgument);

    if (resultArgument.getNumericData() !== 0)
        return resultArgument;


    // startTime = performance.now();

    // // Connect to the PostgreSQL database
    // await client.connect()
    // .then(() => log('Connected to PostgreSQL database'))
    // .catch((err) => console.error('Error connecting to PostgreSQL database:', err));

    // endTime = performance.now();
    // timeDiff = endTime - startTime; // 실행 시간 (밀리초)
    // console.log(`====Connection execution time: ${timeDiff} milliseconds`);

    // Begin a transaction block
    await client.query('BEGIN');

    // Call the function with varying IN parameters and the cursor OUT parameter
    //let query = 'SELECT * FROM public.f_stnd0001_load($1, $2);';
    // log("=====", schema, procName, strParam, pValueList);
    let query = `SELECT * from ${pProcName}(`;
    pValueList.forEach((param, index) => {
        query += `$${index + 1}`;
      if (index !== pValueList.length - 1) {
        query += ', ';
      }
    });
    query += ');';
    
    const queryResult = await client.query(query, pValueList);
    const dc = new dataContainer();
    var cursorName = [];

    // log("=======queryResult", queryResult)
    for (const row of resultArgument.getCursorData()[0].rows) {

      const paramName = row['parameter_name'];
      const outParamValue = queryResult.rows[0][paramName];

      switch (row['data_type']) {
        case 'integer':
          dc.setNumericData(outParamValue);
          break;
        case 'text':
          dc.setTextData(outParamValue);
          break;
        case 'refcursor':
          cursorName.push(outParamValue);
          break;
      }
    }

    const resultArray = [];
    const fieldsArray = [];
    for (let val of cursorName)
    {
        if (val === null)
          continue;
        
        // log("-------------------------------------------------", val);
        const fetchAllQuery = `FETCH ALL FROM "${val}";`;
        const cursorResult  = (await client.query(fetchAllQuery));
        //console.log(val);
        // log("================", cursorResult);
        //console.log(cursorResult.rows);
        resultArray.push({ data:cursorResult.rows, fields:cursorResult.fields});

        //await client.query(`CLOSE "${val}";`);
    }

    await client.query('COMMIT');
    
    dc.setCursorData(resultArray);
    // log("================", JSON.stringify(dc.getCursorData()[0]));
    return dc;
  } catch (err) {
    // Rollback the transaction block in case of an error
    await client.query('ROLLBACK');
    error('Error executing PostgreSQL function:', err);
    return [];
  } finally {
    // Close the database connection
    // client.end();
    client.release();
  }
}

async function getArgument(client, pSchema, pProcName, pParamList) {
    try {  
      // Begin a transaction block
      await client.query('BEGIN');
      let catalog = '';
      let schema = pSchema;
      let procName = pProcName;
      let paramList = pParamList;

      let varyingParams = [catalog, schema, procName, paramList];    
      // Call the function with varying IN parameters and the cursor OUT parameter
      let query = 'SELECT * FROM public.f_admn_get_arguments($1, $2, $3, $4);';
      let { rows } = await client.query(query, varyingParams);

      endTime = performance.now();
      timeDiff = endTime - startTime; // 실행 시간 (밀리초)
      console.log(`getArgument Qeury Code execution time: ${timeDiff} milliseconds`);

      startTime = performance.now();

      let dc = new dataContainer();
      var cursorName = [];
      // Process the cursor result as if it were a DataTable
      for (let row of rows) {
          // Access values in each row as needed
          for (let columnName in row) {
            // Check if the property exists in the row
            if (Object.prototype.hasOwnProperty.call(row, columnName)) {
                // Access the column value dynamically
                let columnValue = row[columnName];

                if (columnName.startsWith("n_return")){
                    dc.setNumericData(columnValue);
                }
                
                if (columnName.startsWith("v_return")){
                    dc.setTextData(columnValue);
                }
                
                if (columnName.startsWith("c_return"))
                    cursorName.push(columnValue)
            }
          }
          //console.log('----------');
        }

    if (dc.getNumericData() != 0)
        return dc;

        let resultArray = [];
      for (let val of cursorName)
      {
          //console.log(val);
          let fetchAllQuery = `FETCH ALL FROM "${val}";`;
          let cursorResult = (await client.query(fetchAllQuery));
          resultArray.push(cursorResult)
  
          await client.query(`CLOSE "${val}";`);
      }
  
      await client.query('COMMIT');
      
      dc.setCursorData(resultArray);
  
      return dc;
    } catch (err) {
      // Rollback the transaction block in case of an error
      await client.query('ROLLBACK');
      error('Error executing PostgreSQL function:', err);

      let dc = new dataContainer();
      dc.setNumericData(-1);
      dc.setTextData(err);
      dc.setCursorData(null);

      return dc;
    } finally {
      // Close the database connection
      // await client.end();
    }
  }

module.exports = {
    callFunction
};