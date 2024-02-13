function log(...args) {
    // eslint-disable-next-line no-console -- logger
    const production = process.env.NODE_ENV.indexOf('production') > -1;
    const development = process.env.NODE_ENV.indexOf('development') > -1;

    // console.log("LOGGER: ", process.env.NODE_ENV, development);
    development && console.log("LOGGER: ", ...args);
  };

module.exports = {
  log
}