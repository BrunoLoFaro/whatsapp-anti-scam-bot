import mongoose from 'mongoose';
import logger from '../../Infrastructure/logging/logger.js';

export default async function connectToMongo(): Promise<void> {
  try {//TODO connect to MongoAtlasDB
    //await mongoose.connect(process.env.MONGODB_URI as string);
    logger.info('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}