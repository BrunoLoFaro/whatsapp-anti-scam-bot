import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  from: string;
  body: string;
  timestamp: Date;
  status: string;
}

const MessageSchema = new Schema<IMessage>({//TO DO: redo models
  from: { type: String, required: true },
  body: { type: String, required: true },
  timestamp: { type: Date, required: true },
  status: { type: String, required: true }
});

export default mongoose.model<IMessage>('Message', MessageSchema);