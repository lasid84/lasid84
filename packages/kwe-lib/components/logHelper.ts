  
  
  export function log(...args:any[]) {
    // eslint-disable-next-line no-console -- logger
    const production = process.env.NODE_ENV.indexOf('production') > -1;
    const development = process.env.NODE_ENV.indexOf('development') > -1;

    // console.log("LOGGER: ", process.env.NODE_ENV, development);
    // console.log("====", myFunction());
    development && console.log("LOGGER: ", ...args);
  };

  export function error(...args: any[]) {
    console.log("Error LOGGER: ", ...args);
  };
