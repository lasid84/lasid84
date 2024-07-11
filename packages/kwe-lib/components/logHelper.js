const fs = require('fs');
const path = require('path');

function log(...args) {
    // eslint-disable-next-line no-console -- logger
    const production = process.env.NODE_ENV.indexOf('production') > -1;
    const development = process.env.NODE_ENV.indexOf('development') > -1;

    // console.log("LOGGER: ", process.env.NODE_ENV, development);
    // console.log("====", myFunction());
    development && console.log("LOGGER: ", ...args);
  };

  function error(...args) {
    console.log("Error LOGGER: ", ...args);
  };

  function logWithFile(...args) {

    const logFilePath = path.join(__dirname, 'logfile.log');

    // eslint-disable-next-line no-console -- logger
    const production = process.env.NODE_ENV.indexOf('production') > -1;
    const development = process.env.NODE_ENV.indexOf('development') > -1;
    
    const timestamp = new Date().toISOString();
    var message = args.map(m => m + '\n\n').join('');
    const logEntry = `${timestamp} - ${message}`;

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('로그 파일에 메시지를 기록할 수 없습니다.', err);
        } else {
            console.log('로그 메시지가 기록되었습니다:', logEntry);
        }
    });
    
  };

  function error(...args) {
    console.log("Error LOGGER: ", ...args);
  };


  // function myFunction() {
  //   const error = new Error();
  //   if (error.stack) {
  //     const stackLines = error.stack.split('\n');
  //     // 두 번째 줄에서 호출 스택의 첫 번째 함수 이름을 가져옵니다.
  //     const callerName = stackLines[2].trim().split(' ')[1];
  //     console.log("Caller function:", callerName);
  //   } else {
  //     console.log("Could not retrieve caller function name");
  //   }
  // }

module.exports = {
  log, error, logWithFile
}