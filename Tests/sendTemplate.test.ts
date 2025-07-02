import { describe, test, beforeEach, jest, expect } from '@jest/globals';

// 0) Mocka el repositorio de usuarios para que no invoque hGet real:
jest.mock(
  '../Infrastructure/database/userRepository.js',
  () => {
    const fakeRepo = {
      retrieveUserReceivedMessage: jest.fn().mockResolvedValue('Hola' as never),
      retrieveUserState: jest.fn().mockResolvedValue('GREETED' as never),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };
    return {
      __esModule: true,
      UserRepository: {
        getInstance: () => fakeRepo
      },
      UserState: {
        NEW: 'NEW',
        GREETED: 'GREETED',
        // …otros si los usas
      }
    };
  }
);

// 1) MOCK axios …
jest.mock('axios', () => ({ __esModule: true, default: { post: jest.fn() } }));
// 2) MOCK config.js …
jest.mock('../config.js', () => ({ __esModule: true, default: {
  /* …tus props… */
  redisUri: 'redis://localhost:6379'
}}));
// 3) MOCK logger.js …
jest.mock('../Infrastructure/logging/logger.js', () => ({ __esModule: true, default: {
  info: jest.fn(), error: jest.fn()
}}));
// 4) MOCK redis (solo createClient) …
jest.mock('redis', () => ({ __esModule: true, createClient: jest.fn().mockReturnValue({
  on: jest.fn(),
  connect: jest.fn()
})}));


// --- 5) AHORA importas TODO usando extensiones “.js” ---
import axios from 'axios';
import sendUserTemplate from '../Infrastructure/whatsapp/sendTemplate.js';
import config         from '../config.js';
import logger         from '../Infrastructure/logging/logger.js';


const mockPost = axios.post as jest.MockedFunction<typeof axios.post>;

describe('Probando envio de Plantillas a la API de WhatsApp', () => {
  const userPhoneNumber = '5491123456789';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should send midFlowTemplateFlowName template with buttons', async () => {
    (config as any).midFlowTemplateFlowName = 'mid_flow_template';
    mockPost.mockResolvedValue({ data: { success: true } });

    const result = await sendUserTemplate('mid_flow_template', userPhoneNumber);

    expect(mockPost).toHaveBeenCalled();
    const [, data] = mockPost.mock.calls[0];
    expect((data as any).template.name).toBe('mid_flow_template');
    expect((data as any).template.components).toBeDefined();
    expect(((result as any).data).success).toBe(true);
  });

  test('should send greetTemplateFlowName template without buttons', async () => {
    (config as any).greetTemplateFlowName = 'greet_template';
    mockPost.mockResolvedValue({ data: { success: true } });

    const result = await sendUserTemplate('greet_template', userPhoneNumber);

    expect(mockPost).toHaveBeenCalled();
    const [, data] = mockPost.mock.calls[0];
    expect((data as any).template.name).toBe('greet_template');
    expect((data as any).template.components).toBeUndefined();
    expect(((result as any).data).success).toBe(true);
  });

  test('should send shareFlowTemplateFlowName template with body parameters', async () => {
    (config as any).shareFlowTemplateFlowName = 'share_template';
    mockPost.mockResolvedValue({ data: { success: true } });

    const result = await sendUserTemplate('share_template', userPhoneNumber);

    expect(mockPost).toHaveBeenCalled();
    const [, data] = mockPost.mock.calls[0];
    expect((data as any).template.name).toBe('share_template');
    expect((data as any).template.components[0].type).toBe('body');
    expect(((result as any).data).success).toBe(true);
  });

  test('should send default template if template name does not match any case', async () => {
    mockPost.mockResolvedValue({ data: { success: true } });

    const result = await sendUserTemplate('unknown_template', userPhoneNumber);

    expect(mockPost).toHaveBeenCalled();
    const [, data] = mockPost.mock.calls[0];
    expect((data as any).template.name).toBe('unknown_template');
    expect(((result as any).data).success).toBe(true);
  });

  test('should return error response if axios throws', async () => {
    const error = { response: { data: { error: { message: 'fail' } } } };
    mockPost.mockRejectedValue(error as any);

    const result = await sendUserTemplate('greet_template', userPhoneNumber);

    expect(result).toEqual(error.response.data.error);
  });
});