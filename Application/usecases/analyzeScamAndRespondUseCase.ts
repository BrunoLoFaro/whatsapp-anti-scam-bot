import sendUserReply from "./sendUserReplyUseCase.js";
import processPrompt from "../../Infrastructure/openRouter/openRouter.js";
import { IReply } from "./sendUserReplyUseCase.js"

export interface IMessageReceived {
    textMessage: string,
    from: string
}

/**
 * Analyzes a WhatsApp message for potential scams using an AI model and sends an appropriate response.
 * @param textMessage - The incoming WhatsApp message text to analyze.
 * @param from - The sender's identifier to reply to.
 * @returns A promise that resolves when the response has been sent.
 */
export default async function askModelForAdvice(messageReceived: IMessageReceived): Promise<void> {

    let modelResponse = await processPrompt(false, messageReceived.textMessage);

    let reply: IReply = {
        message: '',
        userPhoneNumber: messageReceived.from
    }       

    if (!modelResponse) {
        reply.message = "Lo siento, no pude procesar tu mensaje.";
        await sendUserReply(reply);
        return;
    }

    modelResponse = modelResponse.replace(/\*/g, "");

    reply.message = modelResponse;

    await sendUserReply(reply);
}