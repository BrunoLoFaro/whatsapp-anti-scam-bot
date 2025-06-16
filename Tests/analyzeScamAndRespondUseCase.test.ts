import sendReplyToWpp from "../Infrastructure/whatsapp/sendReply.js";
import processPrompt from "../Infrastructure/openRouter/openRouter.js";
import analyzeScamAndRespond from "../Application/usecases/analizeScamAndRespondUseCase.js"

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
    const from = "12345";
    const textMessage = "Test message";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should send model response if processPrompt returns a response", async () => {
        mockedProcessPrompt.mockResolvedValueOnce("AI response");

        await analyzeScamAndRespond(textMessage, from);

        expect(mockedProcessPrompt).toHaveBeenCalledWith(textMessage);
        expect(mockedSendReplyToWpp).toHaveBeenCalledWith("AI response", from);
    });

    test("should send error message if processPrompt returns null/undefined", async () => {
        mockedProcessPrompt.mockResolvedValueOnce(null as any);

        await analyzeScamAndRespond(textMessage, from);

        expect(mockedProcessPrompt).toHaveBeenCalledWith(textMessage);
        expect(mockedSendReplyToWpp).toHaveBeenCalledWith("Lo siento, no pude procesar tu mensaje.",from);
    });

    test("should send error message if processPrompt throws", async () => {
        mockedProcessPrompt.mockRejectedValueOnce(new Error("fail"));

        await expect(analyzeScamAndRespond(textMessage, from)).rejects.toThrow("fail");
        expect(mockedSendReplyToWpp).not.toHaveBeenCalled();
    });
});