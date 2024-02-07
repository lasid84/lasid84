function log(...args) {
    // eslint-disable-next-line no-console -- logger
    const production = process.env.NODE_ENV === 'production';
    const development = process.env.NODE_ENV === 'development';

    // console.log("LOGGER: ", process.env.NODE_ENV, ...args);

    development && console.log("LOGGER: ", ...args);
  };

module.exports = {
  log
}