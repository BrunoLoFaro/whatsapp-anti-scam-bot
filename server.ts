import dotenv from 'dotenv';
import connectToMongo from './Infrastructure/database/mongo.js';
import logger from './Infrastructure/logging/logger.js';
import config from './config.js'
import startAPIServer from './API/index';

dotenv.config();

logger.info('Starting server...');

const configPropiedades = Object.values(config);
configPropiedades.forEach(propiedad => {
    if (!propiedad){
        logger.error('Archivo .env o config incompleto o no existente, abortando...');
        throw new Error('Propiedad en archivo .env o config no definida');
    }
});

await connectToMongo();

startAPIServer();
