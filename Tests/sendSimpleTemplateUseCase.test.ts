import sendTemplate from '../Application/usecases/sendSimpleTemplateUseCase.js';
import sendUserTemplate from '../Infrastructure/whatsapp/sendTemplate.js';
import { describe, test, jest, expect, beforeEach } from '@jest/globals';
import config from '../config.js';

jest.mock('../Infrastructure/whatsapp/sendTemplate');

jest.mock('../Infrastructure/logging/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

jest.mock('../config.js', () => ({
  __esModule: true,
  default: { redisUri: 'redis://localhost:6379' }
}));


const mockedSendUserTemplate = sendUserTemplate as jest.MockedFunction<typeof sendUserTemplate>;

describe('Caso de uso: Enviar template simple', () => {
  const userTemplateFlow = {
    template: 'nombre_del_template',
    userPhoneNumber: '123456789'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

test('should call sendUserTemplate with the correct parameters', async () => {
    // Simulate a successful response
    mockedSendUserTemplate.mockResolvedValueOnce({ success: true });

    await sendTemplate(userTemplateFlow);

    expect(mockedSendUserTemplate).toHaveBeenCalledWith(
        userTemplateFlow.template,
        userTemplateFlow.userPhoneNumber
    );
});
});