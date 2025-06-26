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

logger.info("Starting server...");

process.on('uncaughtException', function(error) {
    logger.error(`uncaughtException: ${error}`);
});

process.on('unhandledRejection', function(reason, promise) {
    logger.error(`unhandledRejection: ${reason} --> from: ${JSON.stringify(promise)}`);
});

const configPropiedades = Object.entries(config);

const propiedadesFaltantes = configPropiedades.filter(([clave, valor]) => valor === undefined || valor === null || valor === ""); //Filtra aquellas claves que tienen como valores datos indefinidos, nulos o vacios

if (propiedadesFaltantes.length > 0) {

  propiedadesFaltantes.forEach(([clave]) => {
    logger.error(`La propiedad '${clave}' no está definida en el archivo .env o en config.js`);
  });

  await new Promise((resolve) => setTimeout(resolve, 100));
  process.exit(1);
}

await connectToMongo();

apiServer.listen(config.webPort, function () {
  logger.info(`API Server listening on Port ${config.webPort} ...`);
});
