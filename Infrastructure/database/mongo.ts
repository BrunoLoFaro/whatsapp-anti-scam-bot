import dotenv from 'dotenv';
dotenv.config(); // Cargar las variables de entorno desde el archivo .env

import mongoose from 'mongoose';
import logger from '../../Infrastructure/logging/logger.js';

export default async function connectToMongo(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    logger.info('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}