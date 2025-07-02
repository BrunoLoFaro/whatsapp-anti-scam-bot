import dotenv from 'dotenv';


import express from 'express';
import logger, { initializeLogger } from './Infrastructure/logging/logger.js'; // Importa la función de inicialización
import { connectRedis } from './Infrastructure/database/redisClient.js'; // Importa la función de inicialización
import config from './config.js'
import whatsAppWebHookRoute from './API/routes/webhook.route.js';
import infoHealthRoute from './API/routes/info.health.route.js';


async function startServer() {
  try {
    dotenv.config();
    await initializeLogger();

    const configPropiedades = Object.entries(config);
    const propiedadesFaltantes = configPropiedades.filter(([clave, valor]) => valor === undefined || valor === null || valor === "");

    if (propiedadesFaltantes.length > 0) {
      propiedadesFaltantes.forEach(([clave]) => {
        logger.error(`CONFIG ERROR: La propiedad '${clave}' no está definida en el archivo .env o en config.js`);
      });
      logger.error("El servidor no puede iniciar debido a configuración faltante. Saliendo...");
      await new Promise((resolve) => setTimeout(resolve, 100)); // Pequeña pausa para asegurar que el log se escriba
      process.exit(1);
    }
    logger.info("Configuración validada correctamente.");


    await connectRedis();


    const apiServer = express();

    // Middleware
    apiServer.use(express.json());

    // Routes
    apiServer.use(whatsAppWebHookRoute);
    apiServer.use(infoHealthRoute);

    // Handlers de errores globales
    process.on('uncaughtException', function(error) {
        logger.error(`uncaughtException: ${error}`);
    });
    process.on('unhandledRejection', function(reason, promise) {
        logger.error(`unhandledRejection: ${reason}`);
    });


    apiServer.listen(config.webPort, function () {
      logger.info(`API Server listening on Port ${config.webPort} ...`);
    });

  } catch (error) {

    console.error("Error fatal durante el arranque del servidor:", error);
    if (logger) {
      logger.error(`Error fatal durante el arranque del servidor: ${error}`);
    }
    process.exit(1);
  }
}

startServer();
