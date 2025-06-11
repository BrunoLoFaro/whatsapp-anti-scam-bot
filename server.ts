import dotenv from "dotenv";
import express from "express";
import connectToMongo from "./Infrastructure/database/mongo.js";

import logger from "./Infrastructure/logging/logger.js";
import config from "./config.js";
import whatsAppWebHookRoute from "./API/routes/webhook.route.js";

const apiServer = express();

//Middleware
apiServer.use(express.json());

//Routes
apiServer.use(whatsAppWebHookRoute);

dotenv.config();

logger.info("Starting server...");

const configPropiedades = Object.entries(config);
const propiedadesFaltantes = configPropiedades.filter(
  ([clave, valor]) => valor === undefined || valor === null || valor === ""); //Filtra aquellas claves que tienen como valores datos indefinidos, nulos o vacios
if (propiedadesFaltantes.length > 0) {
  propiedadesFaltantes.forEach(([clave]) => {
    logger.error(
      `❌ La propiedad '${clave}' no está definida en el archivo .env o en config.js`
    );
  });
  throw new Error(
    "⚠️ Configuración incompleta: faltan propiedades en el archivo .env o config.js"
  );
}
await connectToMongo();

apiServer.listen(config.webPort, function () {
  logger.info(`API Server listening on Port ${config.webPort} ...`);
});
