import sendReplyToWpp from "../Infrastructure/whatsapp/sendReply.js";
import processPrompt from "../Infrastructure/openRouter/openRouter.js";
import analyzeScamAndRespond from "../Application/usecases/analyzeScamAndRespondUseCase.js"
import { IMessageReceived } from "../Application/usecases/analyzeScamAndRespondUseCase.js";

import { describe, test, jest, expect, beforeEach } from '@jest/globals'

jest.mock("../Infrastructure/whatsapp/sendReply");
jest.mock("../Infrastructure/openRouter/openRouter");

jest.mock('../Infrastructure/logging/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

const mockedSendReplyToWpp = sendReplyToWpp as jest.MockedFunction<typeof sendReplyToWpp>;
const mockedProcessPrompt = processPrompt as jest.MockedFunction<typeof processPrompt>;

describe("Testeo del Caso de Uso de Analizar el Mensaje de Estafa y Responder", () => {
    const messageReceived: IMessageReceived = {
        from: "12345",
        textMessage: "Test message"
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should send model response if processPrompt returns a response", async () => {
        mockedProcessPrompt.mockResolvedValueOnce("AI response");

        await analyzeScamAndRespond(messageReceived);

        expect(mockedProcessPrompt).toHaveBeenCalledWith(messageReceived.textMessage);
        expect(mockedSendReplyToWpp).toHaveBeenCalledWith("AI response", messageReceived.from);
    });

    test("should send error message if processPrompt returns null/undefined", async () => {
        mockedProcessPrompt.mockResolvedValueOnce(null as any);

        await analyzeScamAndRespond(messageReceived);

        expect(mockedProcessPrompt).toHaveBeenCalledWith(messageReceived.textMessage);
        expect(mockedSendReplyToWpp).toHaveBeenCalledWith("Lo siento, no pude procesar tu mensaje.", messageReceived.from);
    });

    test("should send error message if processPrompt throws", async () => {
        mockedProcessPrompt.mockRejectedValueOnce(new Error("fail"));

        await expect(analyzeScamAndRespond(messageReceived)).rejects.toThrow("fail");
        expect(mockedSendReplyToWpp).not.toHaveBeenCalled();
    });
});