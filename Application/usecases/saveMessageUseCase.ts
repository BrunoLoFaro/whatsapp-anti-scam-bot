import Message, { IMessage } from '../../Domain/models/message.js';

export async function saveMessageUseCase(messageData: Partial<IMessage>): Promise<IMessage> {//here goes the buiseness logic
  const message = new Message({
    ...messageData,
    timestamp: new Date(),
    status: 'received'
  });
  return await message.save();
}