import dotenv from 'dotenv';
import express from 'express';
import connectToMongo from './Infrastructure/database/mongo.js';

import logger from './Infrastructure/logging/logger.js';
import config from './config.js'
import whatsAppWebHookRoute from './API/routes/webhook.route.js';

const apiServer = express();

//Middleware
apiServer.use(express.json());

//Routes
apiServer.use(whatsAppWebHookRoute);

dotenv.config();

logger.info('Starting server...');

process.on('uncaughtException', function(error) {
    logger.error(`uncaughtException: ${error}`);
});

process.on('unhandledRejection', function(reason, promise) {
    logger.error(`unhandledRejection: ${reason} --> from: ${JSON.stringify(promise)}`);
});

const configPropiedades = Object.values(config);
configPropiedades.forEach(propiedad => {
    if (!propiedad){
        logger.error('Archivo .env o config incompleto o no existente, abortando...');
        throw new Error('Propiedad en archivo .env o config no definida');
    }
});

await connectToMongo();

apiServer.listen(config.webPort, function() {
    logger.info(`API Server listening on Port ${config.webPort} ...`);
});