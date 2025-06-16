import analizeScamAndRespond from "../../Application/usecases/analizeScamAndRespondUseCase.js";
import logger from "../../Infrastructure/logging/logger.js";

interface Imessage {
    from: string; // Número remitente (debe coincidir con wa_id)
    id: string; // ID único del mensaje (Ej: "ABGGFlA5Fpa")
    timestamp: string; // Unix timestamp (Ej: "1504902988")
    type: "text"; // Puede ser también "image", "audio", etc.
    text?: {
    body: string; // Contenido del mensaje (Ej: "this is a text message")
    };
}

export default async function handleIncomingMessage(message: Imessage): Promise<void> {
    const from = message.from;
    const textMessage = message.text ? message.text.body : null;

    if (!textMessage){
        return;
    }
    
    try {
        await analizeScamAndRespond(textMessage, from);
    } catch (error) {
        logger.error(`Ocurrió un error al analizar y responder el mensaje: ${error}`);
        return;
    }
}