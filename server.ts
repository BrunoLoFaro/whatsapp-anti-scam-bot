import express from 'express';
import dotenv from 'dotenv';
import connectToMongo from './Infrastructure/database/mongo.js';
import logger from './Infrastructure/logging/logger.js';
import api from './API/index.js';
import config from './config.js'

dotenv.config();
const app = express();
app.use(express.json());

logger.info('Starting server...');

const configPropiedades = Object.values(config);
configPropiedades.forEach(propiedad => {
    if (!propiedad){
        logger.error('Archivo .env o config incompleto o no existente, abortando...');
        throw new Error('Propiedad en archivo .env o config no definida');
    }
});

await connectToMongo();

app.use('/api', api);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));