import sendTemplate from "../../Application/usecases/sendSimpleTemplateUseCase.js";
import askModelForAdvice from "../../Application/usecases/askModelforAdviceUseCase.js";
import { IUserTemplate } from "../../Application/usecases/sendSimpleTemplateUseCase.js";
import config from "../../config.js";

interface IButton {
    payload: string,
    text: string
}

let userTemplateFlow: IUserTemplate = {
    template: '',
    userPhoneNumber: ''
}

export default async function handleIncomingButton(button: IButton, userPhoneNumber: string){
    userTemplateFlow.userPhoneNumber = userPhoneNumber;

    switch (button.payload) {
        case 'ADVICE_BUTTON':
            await askModelForAdvice(userPhoneNumber);            
            break;
        case 'SHARE_BUTTON':
            userTemplateFlow.template = config.shareFlowTemplateFlowName ?? "seguriamigo_user_error_flow";
            await sendTemplate(userTemplateFlow);
            userTemplateFlow.template = config.terminateFlowTemplateFlowName ?? "seguriamigo_user_error_flow";
            await sendTemplate(userTemplateFlow);
            break;
        case 'TERMINATE_BUTTON':
            userTemplateFlow.template = config.terminateFlowTemplateFlowName ?? "seguriamigo_user_error_flow";
            await sendTemplate(userTemplateFlow);
            break;
    
        default:
            break;
    }
}
