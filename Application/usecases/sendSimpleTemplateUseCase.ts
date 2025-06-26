import sendUserTemplate from "../../Infrastructure/whatsapp/sendTemplate.js";

export interface IUserTemplate {
    template: string,
    userPhoneNumber: string
}

export default async function sendTemplate(userTemplateFlow: IUserTemplate){
    await sendUserTemplate(userTemplateFlow.template, userTemplateFlow.userPhoneNumber);
}