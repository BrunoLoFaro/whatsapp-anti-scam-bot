import express from 'express';
import dotenv from 'dotenv';
import connectToMongo from './Infrastructure/database/mongo.js';
import logger from './Infrastructure/logging/logger.js';
import api from './API/index.js';

dotenv.config();
const app = express();
app.use(express.json());

logger.info('Starting server...');

await connectToMongo();

app.use('/api', api);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));