import sendUserReply from '../Application/usecases/sendUserReplyUseCase.js';
import sendReplyToWpp from '../Infrastructure/whatsapp/sendReply.js';
import { describe, test, jest, expect, beforeEach } from '@jest/globals';

jest.mock('../Infrastructure/whatsapp/sendReply');

jest.mock('../Infrastructure/logging/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

const mockedSendReplyToWpp = sendReplyToWpp as jest.MockedFunction<typeof sendReplyToWpp>;

describe('Caso de uso: Enviar respuesta al usuario', () => {
  const reply = {
    message: 'Mensaje de respuesta',
    userPhoneNumber: '123456789'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

test('should call sendReplyToWpp with the correct parameters', async () => {
    // Simulate a successful resolution of sendReplyToWpp
    mockedSendReplyToWpp.mockResolvedValueOnce({ success: true });

    await sendUserReply(reply);

    expect(mockedSendReplyToWpp).toHaveBeenCalledWith(reply.message, reply.userPhoneNumber);
});
});