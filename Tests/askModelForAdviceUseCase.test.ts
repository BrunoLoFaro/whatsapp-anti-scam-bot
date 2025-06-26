import askModelForAdvice from '../Application/usecases/askModelForAdviceUseCase.js';
import sendUserReply from '../Application/usecases/sendUserReplyUseCase.js';
import processPrompt from '../Infrastructure/openRouter/openRouter.js';
import { describe, test, jest, expect, beforeEach } from '@jest/globals';

jest.mock('../Application/usecases/sendUserReplyUseCase');
jest.mock('../Infrastructure/openRouter/openRouter');
jest.mock('../Infrastructure/logging/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

const mockedSendUserReply = sendUserReply as jest.MockedFunction<typeof sendUserReply>;
const mockedProcessPrompt = processPrompt as jest.MockedFunction<typeof processPrompt>;

describe('Caso de uso: solicitar consejo al modelo de IA', () => {
    const userPhoneNumber = '123456789';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should send the model response when advice is obtained', async () => {
        const fakeResponse = "Consejo de seguridad";
        mockedProcessPrompt.mockResolvedValueOnce(fakeResponse);

        await askModelForAdvice(userPhoneNumber);

        expect(mockedProcessPrompt).toHaveBeenCalledWith(true);
        expect(mockedSendUserReply).toHaveBeenCalledWith({
            message: fakeResponse,
            userPhoneNumber,
        });
    });

    test('should send error message when model response is null', async () => {
        mockedProcessPrompt.mockResolvedValueOnce(null);

        await askModelForAdvice(userPhoneNumber);

        expect(mockedProcessPrompt).toHaveBeenCalledWith(true);
        expect(mockedSendUserReply).toHaveBeenCalledWith({
            message: "Lo siento, no pude procesar tu pedido",
            userPhoneNumber,
        });
    });
});