export const log = (...args: any[]) => {

    const env = process.env.NODE_ENV as string;
    const production = env?.indexOf('production') > -1;
    const development = env?.indexOf('development') > -1;
  
    !production && console.log("LOGGER: ", ...args);
  
  };
  
  
  export const error = (...args: any[]) => {
    console.log("Error LOGGER: ", ...args);
  };