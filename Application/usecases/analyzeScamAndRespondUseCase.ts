import sendReplyToWpp from "../../Infrastructure/whatsapp/sendReply.js";
import processPrompt from "../../Infrastructure/openRouter/openRouter.js";

/**
 * Analyzes a WhatsApp message for potential scams using an AI model and sends an appropriate response.
 * @param textMessage - The incoming WhatsApp message text to analyze.
 * @param from - The sender's identifier to reply to.
 * @returns A promise that resolves when the response has been sent.
 */
export default async function analyzeScamAndRespond(textMessage: string, from: string): Promise<void> {

    const modelResponse = await processPrompt(textMessage);

    if (!modelResponse) {
        await sendReplyToWpp("Lo siento, no pude procesar tu mensaje.", from);
        return;
    }

    await sendReplyToWpp(modelResponse, from);
}