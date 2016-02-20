var winston = require('winston');
var log = new (winston.Logger)({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'white',
    verbose: 'white',
    debug: 'green',
    silly: 'green'
  }
});

log.add(winston.transports.Console, {
  level: 'silly',
  prettyPrint: true,
  colorize: true,
  silent: false,
  timestamp: false
});

/*
log.add(winston.transports.File, {
  prettyPrint: false,
  level: 'silly',
  silent: false,
  colorize: true,
  timestamp: true,
  filename: './log/default.log',
  maxsize: 40000,
  maxFiles: 10,
  json: false
});
*/
module.exports = log;
