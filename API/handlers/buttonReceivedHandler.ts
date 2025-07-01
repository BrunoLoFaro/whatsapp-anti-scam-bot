import sendTemplate from "../../Application/usecases/sendSimpleTemplateUseCase.js";
import askModelForAdvice from "../../Application/usecases/askModelForAdviceUseCase.js";
import sendUserReply, { IReply } from "../../Application/usecases/sendUserReplyUseCase.js";
import { IUserTemplate } from "../../Application/usecases/sendSimpleTemplateUseCase.js";
import config from "../../config.js";
import logger from "../../Infrastructure/logging/logger.js";
import { UserRepository } from "../../Infrastructure/database/userRepository.js";

interface IButton {
    payload: string,
    text: string
}

let userTemplateFlow: IUserTemplate = {
    template: '',
    userPhoneNumber: ''
}

let reply: IReply = {
    message: '',
    userPhoneNumber: ''
}

export default async function handleIncomingButton(button: IButton, userPhoneNumber: string){
    userTemplateFlow.userPhoneNumber = userPhoneNumber;
    reply.userPhoneNumber = userPhoneNumber;

    switch (button.payload) {
        case 'ADVICE_BUTTON':
            reply.message = 'Aguarde...';
            await sendUserReply(reply); 

            await askModelForAdvice(userPhoneNumber);

            userTemplateFlow.template = config.midFlowTemplateFlowName ?? "seguriamigo_user_error_flow";
            await sendTemplate(userTemplateFlow);      

            break;

        case 'SHARE_BUTTON':
            userTemplateFlow.template = config.shareFlowTemplateFlowName ?? "seguriamigo_user_error_flow";
            await sendTemplate(userTemplateFlow);

            userTemplateFlow.template = config.midFlowTemplateFlowName ?? "seguriamigo_user_error_flow";
            await sendTemplate(userTemplateFlow);

            break;

        case 'TERMINATE_BUTTON':
            userTemplateFlow.template = config.terminateFlowTemplateFlowName ?? "seguriamigo_user_error_flow";
            
            await sendTemplate(userTemplateFlow);

            logger.info(`Conversacion terminada con: ${userPhoneNumber} procesando baja en BD Redis...`);
            UserRepository.getInstance().deleteUser({phoneNumber: userPhoneNumber});
            logger.info(`Baja de: ${userPhoneNumber} procesada con exito!`);

            break;
    
        default:

            userTemplateFlow.template = config.errorFlowTemplateFlowName ?? "seguriamigo_user_error_flow"; 
            reply.message = 'Por favor elija una opcion mediante el pulsador de botones...';
            await sendUserReply(reply);
                
            break;
    }
}
