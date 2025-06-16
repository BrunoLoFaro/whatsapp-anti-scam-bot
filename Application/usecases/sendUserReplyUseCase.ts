import sendReplyToWpp from "../../Infrastructure/whatsapp/sendReply.js";

export interface IReply {
    message: string,
    userPhoneNumber: string
}

export default async function sendUserReply(reply: IReply): Promise<void>{
    
    await sendReplyToWpp(reply.message, reply.userPhoneNumber);
}