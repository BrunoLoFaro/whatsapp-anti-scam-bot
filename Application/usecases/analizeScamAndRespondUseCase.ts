import sendReplyToWpp from "../../Infrastructure/whatsapp/sendReply.js";
import processPrompt from "../../Infrastructure/openRouter/openRouter.js";

export default async function analizeScamAndRespond(textMessage: string, from: string): Promise<void> {

    const modelResponse = await processPrompt(textMessage);

    if (!modelResponse) {
        await sendReplyToWpp("Lo siento, no pude procesar tu mensaje.", from);
        return;
    }

    await sendReplyToWpp(modelResponse, from);
};