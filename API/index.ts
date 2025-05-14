import config from '../config';
import express from 'express';
import whatsAppWebHookRoute from './routes/webhook.route';
import logger from '../Infrastructure/logging/logger.js';

const app = express();

//Middleware
app.use(express.json());

//Routes
app.use(whatsAppWebHookRoute);

export default function startAPIServer(): void {
    const PORT = config.webPort || 3000;
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}