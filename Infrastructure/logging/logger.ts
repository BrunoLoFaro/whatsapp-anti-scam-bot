import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logDir = path.resolve('logs');

try{
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
}catch (error){
  console.error(`No se pudo crear el directorio de logs en ${logDir}:`, error);
  await new Promise(resolve => setTimeout(resolve, 100));
  process.exit(1);
}
const logger = winston.createLogger({//TO DO: Add label to Log in a loggerCreator
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }: winston.Logform.TransformableInfo) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  ]
});

export default logger;
