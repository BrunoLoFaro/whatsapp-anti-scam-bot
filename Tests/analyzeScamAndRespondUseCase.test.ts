import sendUserReply from "../Application/usecases/sendUserReplyUseCase.js";
import processPrompt from "../Infrastructure/openRouter/openRouter.js";
import analyzeScamAndRespond from "../Application/usecases/analyzeScamAndRespondUseCase.js";
import { describe, test, jest, expect, beforeEach } from '@jest/globals';

jest.mock("../Application/usecases/sendUserReplyUseCase");
jest.mock("../Infrastructure/openRouter/openRouter");

jest.mock('../Infrastructure/logging/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

const mockedSendUserReply = sendUserReply as jest.MockedFunction<typeof sendUserReply>;
const mockedProcessPrompt = processPrompt as jest.MockedFunction<typeof processPrompt>;

describe("Testeo del Caso de Uso de Analizar el Mensaje de Estafa y Responder", () => {
  const from = "12345";
  const textMessage = "Test message";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should send model response if processPrompt returns a response", async () => {
    mockedProcessPrompt.mockResolvedValueOnce("AI response");

    await analyzeScamAndRespond({ textMessage, from });

    expect(mockedProcessPrompt).toHaveBeenCalledWith(false, textMessage);
    expect(mockedSendUserReply).toHaveBeenCalledWith({
      message: "AI response",
      userPhoneNumber: from,
    });
  });

  test("should send error message if processPrompt returns null/undefined", async () => {
    mockedProcessPrompt.mockResolvedValueOnce(null);

    await analyzeScamAndRespond({ textMessage, from });

    expect(mockedProcessPrompt).toHaveBeenCalledWith(false, textMessage);
    expect(mockedSendUserReply).toHaveBeenCalledWith({
      message: "Lo siento, no pude procesar tu mensaje.",
      userPhoneNumber: from,
    });
  });

  test("should throw if processPrompt throws", async () => {
    mockedProcessPrompt.mockRejectedValueOnce(new Error("fail"));

    await expect(analyzeScamAndRespond({ textMessage, from })).rejects.toThrow("fail");
    expect(mockedSendUserReply).not.toHaveBeenCalled();
  });
});