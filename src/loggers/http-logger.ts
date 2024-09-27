import winston, { Logger, format } from 'winston';

const { json, timestamp, combine } = format;

const fileLogger: Logger = winston.createLogger({
  // for production, you might not need for example 'silly' level to be used,
  // so you specify the minimum level to be logged in you environment variables.
  level: 'http',
  format: combine(timestamp(), json()),
  transports: [
    new (winston.transports.File)({
      filename: './logs/http.log',
    }),
  ],
});

export { fileLogger };
