import sendUserReply from "./sendUserReplyUseCase.js";
import processPrompt from "../../Infrastructure/openRouter/openRouter.js";
import { IReply } from "./sendUserReplyUseCase.js"

/**
 * Analiza un mensaje de WhatsApp para detectar posibles estafas utilizando un modelo de IA,
 * o genera un consejo si no se recibe un mensaje de texto, y envía una respuesta apropiada como template.
 * @param textMessage - El texto del mensaje de WhatsApp recibido que se va a analizar. Parametro opcional, en este caso no se usa
 * @param from - El identificador del remitente al que se debe responder.
 * @param advice - Boolean que indica si se le solicita un consejo a la IA
 * @returns Una promesa que se resuelve cuando el template ha sido enviado.
 */
export default async function askModelForAdvice(userPhoneNumber: string): Promise<void> {

    const modelResponse = await processPrompt(true);

        const reply: IReply = {
            message: '',
            userPhoneNumber: userPhoneNumber
        }       

    if (!modelResponse) {
        reply.message = "Lo siento, no pude procesar tu pedido";
        await sendUserReply(reply);
        return;
    }

    reply.message = modelResponse;

    await sendUserReply(reply);
}