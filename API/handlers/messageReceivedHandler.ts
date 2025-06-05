import sendReplyToWpp from "../../Infrastructure/whatsapp/sendReply.js";
import { IMessage } from "../../Domain/models/message.js";


export default async function handleIncomingMessage(message: IMessage): Promise<void> {
    const from = message.from;
    const textMessage = message.text ? message.text.body : null;

    if (!textMessage){
        return;
    }

    await sendReplyToWpp(`te estoy copiando, dijiste: ${textMessage}`, from);

}