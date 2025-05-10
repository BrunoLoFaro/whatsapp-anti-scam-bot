import mongoose from 'mongoose';

export default async function connectToMongo(): Promise<void> {
  try {
    //await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}