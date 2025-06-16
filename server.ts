import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectToMongo from './Infrastructure/database/mongo.js';

import logger from './Infrastructure/logging/logger.js';
import config from './config.js'
import whatsAppWebHookRoute from './API/routes/webhook.route.js';
import infoHealthRoute from './API/routes/info.health.route.js';

const apiServer = express();

//Middleware
apiServer.use(express.json());

//Routes
apiServer.use(whatsAppWebHookRoute);
apiServer.use(infoHealthRoute);

// dotenv.config() already called at the top

logger.info('Starting server...');

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