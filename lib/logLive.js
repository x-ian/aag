var winston = require('winston');
var logLive = new (winston.Logger)({
  levels: {
    action: 0
  },
  colors: {
    action: 'cyan'
  }
});

logLive.add(winston.transports.Console, {
  level: 'action',
  prettyPrint: true,
  colorize: true,
  silent: false,
  timestamp: false
});

logLive.add(winston.transports.File, {
  prettyPrint: false,
  level: 'action',
  silent: false,
  colorize: false,
  timestamp: true,
  filename: './log/live-actions.log',
  maxsize: 40000,
  maxFiles: 10,
  json: false
});

module.exports = logLive;
