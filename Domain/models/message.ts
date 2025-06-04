import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    from: string; // Número remitente (debe coincidir con wa_id)
    id: string; // ID único del mensaje (Ej: "ABGGFlA5Fpa")
    timestamp: string; // Unix timestamp (Ej: "1504902988")
    type: "text"; // Puede ser también "image", "audio", etc.
    text?: {
    body: string; // Contenido del mensaje (Ej: "this is a text message")
    };
}

const MessageSchema = new Schema<IMessage>({
  from: { type: String, required: true },
  id: { type: String, required: true },
  timestamp: { type: String, required: true },
  type: { type: String, required: true, enum: ['text', 'image', 'audio', 'video', 'document'] },
  text: {
  body: { type: String, required: true },
  },
});

export default mongoose.model<IMessage>('Message', MessageSchema);