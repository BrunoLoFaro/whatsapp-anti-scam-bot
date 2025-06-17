import analyzeScamAndRespond from "../../Application/usecases/analyzeScamAndRespondUseCase.js";
import logger from "../../Infrastructure/logging/logger.js";
import { IMessageReceived } from "../../Application/usecases/analyzeScamAndRespondUseCase.js"
import sendTemplate from "../../Application/usecases/sendSimpleTemplateUseCase.js";
import { IUserTemplate } from "../../Application/usecases/sendSimpleTemplateUseCase.js";
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

function isValidMessage(text: string): boolean {
    // Reject if only numbers or less than 5 characters
    if (/^\d+$/.test(text.trim())) return false;
    if (text.trim().length < 5) return false;
    return true;
}


export default async function handleIncomingMessage(message: IMessage): Promise<void> { 
    const textMessage = message.text ? message.text.body : null

    const userTemplateFlow: IUserTemplate = {
        template: '',
        userPhoneNumber: message.from
    }

    if (!textMessage){
        return;
    }

    const messageReceived: IMessageReceived = {
        from: message.from,
        textMessage: textMessage 
    }
    
    try {

        if (textMessage.match(/hola/i)) {
            userTemplateFlow.template = config.greetTemplateFlowName ?? "seguriamigo_user_error_flow";
        } else {

            if (isValidMessage(textMessage)){
                //await analyzeScamAndRespond(messageReceived);
                userTemplateFlow.template = config.midFlowTemplateFlowName ?? "seguriamigo_user_error_flow"; 
            } else {
                userTemplateFlow.template = config.errorFlowTemplateFlowName ?? "seguriamigo_user_error_flow"; 
            }
        }

        await sendTemplate(userTemplateFlow);
        
    } catch (error) {
        logger.error(`Ocurrió un error al analizar y responder el mensaje: ${error}`);
        return;
    }
}