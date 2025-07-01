import analyzeScamAndRespond from "../../Application/usecases/analyzeScamAndRespondUseCase.js";
import logger from "../../Infrastructure/logging/logger.js";
import { IMessageReceived } from "../../Application/usecases/analyzeScamAndRespondUseCase.js"
import sendTemplate from "../../Application/usecases/sendSimpleTemplateUseCase.js";
import { IUserTemplate } from "../../Application/usecases/sendSimpleTemplateUseCase.js";
import config from "../../config.js";
import sendUserReply, { IReply } from "../../Application/usecases/sendUserReplyUseCase.js";
import { UserRepository, UserState } from "../../Infrastructure/database/userRepository.js";

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

    let reply: IReply = {
        message: '',
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

        const userState = await UserRepository.getInstance().retrieveUserState(message.from);
        
        logger.info(`EL ESTADO ES: ${userState}`);

        switch (userState) {
            case null:
                userTemplateFlow.template = config.greetTemplateFlowName ?? "seguriamigo_user_error_flow";

                logger.info(`Usuario no encontrado: ${messageReceived.from} en la BD Redis, Procesando Creacion ...`); 

                await UserRepository.getInstance().createUser({phoneNumber: messageReceived.from})
                logger.info(`Creado usuario: ${messageReceived.from} en la BD Redis con Exito`);
                
                

                await UserRepository.getInstance().updateUser({phoneNumber: messageReceived.from, state: UserState.GREETED});
                logger.info(`Usuario: ${messageReceived.from} transiciono a estado ${UserState.GREETED} con Exito`);
                break;
            
            case 'GREETED':
                logger.info(`Usuario encontrado: ${message.from} en la BD Redis! con estado: ${userState}`);

                if (isValidMessage(textMessage)){
                    reply.message = 'Aguarde mientras su mensaje es procesado...';
                    await sendUserReply(reply);
                    await analyzeScamAndRespond(messageReceived);
                    userTemplateFlow.template = config.midFlowTemplateFlowName ?? "seguriamigo_user_error_flow";

                    await UserRepository.getInstance().updateUser({phoneNumber: message.from, state: UserState.MIDFLOW, receivedMessage: textMessage});                    
                    logger.info(`Usuario: ${message.from} transiciono a estado MIDFLOW con Exito`);

                } else {
                    userTemplateFlow.template = config.errorFlowTemplateFlowName ?? "seguriamigo_user_error_flow"; 
                }

                break;
            default:
                userTemplateFlow.template = config.errorFlowTemplateFlowName ?? "seguriamigo_user_error_flow"; 
                reply.message = 'Por favor elija una opcion mediante el pulsador de botones...';
                await sendUserReply(reply);
                break;
        }

        await sendTemplate(userTemplateFlow);
        
    } catch (error) {
        logger.error(`Ocurrió un error al analizar y responder el mensaje: ${error}`);
        return;
    }
}