import { createClient } from "redis";
import config from "../../config.js";
import logger from "../logging/logger.js";

const redisClient = createClient({
    url: config.redisUri
});

redisClient.on('error', function(error) {
    logger.error(`Hubo un error creando el cliente de redis: ${error}`);
});

export async function connectRedis() {
    try {
        await redisClient.connect();
        logger.info(`Conexion exitosa hacia la BD Redis`);
    } catch(error) {
        logger.error(`Hubo un error conectado el cliente de redis: ${error}`);
        throw error;
    }
}

export default redisClient;