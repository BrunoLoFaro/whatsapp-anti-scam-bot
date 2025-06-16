import analyzeScamAndRespond from "../../Application/usecases/analyzeScamAndRespondUseCase.js";
import logger from "../../Infrastructure/logging/logger.js";
import { IMessageReceived } from "../../Application/usecases/analyzeScamAndRespondUseCase.js"
import sendUserTemplate from "../../Infrastructure/whatsapp/sendTemplate.js";
import config from "../../config.js";

interface IMessage {
    from: string; // Número remitente (debe coincidir con wa_id)
    id: string; // ID único del mensaje (Ej: "ABGGFlA5Fpa")
    timestamp: string; // Unix timestamp (Ej: "1504902988")
    type: "text"; // Puede ser también "image", "audio", etc.
    text?: {
    body: string; // Contenido del mensaje (Ej: "this is a text message")
    };
}

const midFlowComponents = {
    "action": {
      "buttons": [
        {
            "type": "reply",
            "reply": {
                "id": "advice-button",
                "title": "Consejos Contra Estafas"
            }
        },
        {
            "type": "reply",
            "reply": {
                "id": "share-button",
                "title": "Compartir con un Familiar"
            }
        },
        {
            "type": "reply",
            "reply": {
                "id": "terminate-button",
                "title": "Finalizar Consulta"
            }
        }
      ]
    }
}

export default async function handleIncomingMessage(message: IMessage): Promise<void> { 
    const textMessage = message.text ? message.text.body : null

    if (!textMessage){
        return;
    }
    
    try {

        const messageReceived: IMessageReceived = {
            from: message.from,
            textMessage: textMessage 
        }

        if (textMessage.match(/hola|buenos|días|tardes|buenas|noches/i)) {
            await sendUserTemplate(config.greetTemplateFlowName ?? "seguriamigo_user_error_flow", messageReceived.from, null);
        } else {
            //await analyzeScamAndRespond(messageReceived);
            await sendUserTemplate(config.midFlowTemplateFlowName ?? "seguriamigo_user_error_flow", messageReceived.from, midFlowComponents); 
        }
        
    } catch (error) {
        logger.error(`Ocurrió un error al analizar y responder el mensaje: ${error}`);
        return;
    }
}