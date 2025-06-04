import dotenv from 'dotenv';
import config from '../../config.js';
dotenv.config(); // Cargar las variables de entorno desde el archivo .env

import mongoose from 'mongoose';
import logger from '../../Infrastructure/logging/logger.js';

export default async function connectToMongo(): Promise<void> {
  try {
    await mongoose.connect(config.mongoDBUri as string);
    logger.info('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}