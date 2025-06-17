import OpenAI from 'openai';
import config from '../config.js';
import logger from '../Infrastructure/logging/logger.js';

import { describe, test, jest, expect, beforeEach } from '@jest/globals'

jest.mock('openai');

jest.mock('../config', () => ({
    openRouterBaseUrl: 'https://fake-base-url.com',
    openRouterApiKey: 'fake-api-key',
    openRouterModel: 'fake-model',
    openRouterFallbackModel1: 'fake-fallback-model1',
    openRouterFallbackModel2: 'fake-fallback-model2',
    promptInstructions: 'fake instructions',
    promptAdviceInstructions: 'fake advice instructions',
}));

jest.mock('../Infrastructure/logging/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

const fakePrompt = 'Test prompt';

const fakeResponse = {
    id: '1',
    object: 'chat.completion',
    created: 123456,
    model: 'fake-model',
    choices: [
        {
            index: 0,
            message: { role: 'assistant', content: 'Test response' },
            finish_reason: 'stop',
        },
    ],
    usage: {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
    },
};

let processPrompt: typeof import('../Infrastructure/openRouter/openRouter.js').default;

describe('Probando procesamiento del Prompt con OpenRouterAPI', () => {
    let openAIMockInstance: any;
    let OpenAIMock: jest.Mock;

    beforeEach(async () => {
        jest.clearAllMocks();
        
        // Creamos un mock del constructor
        OpenAIMock = jest.fn().mockImplementation(() => {
            openAIMockInstance = {
                chat: {
                    completions: {
                        create: jest.fn(),
                    },
                },
            };
            return openAIMockInstance;
        });
        
        // Mockeamos el módulo completo
        jest.mock('openai', () => {
            return {
                __esModule: true,
                default: OpenAIMock,
            };
        });

        // Necesitamos re-importar el módulo que usa OpenAI después del mock
        jest.resetModules();
        ({ default: processPrompt } = await import('../Infrastructure/openRouter/openRouter.js'));
    });

    test('should call OpenAI API with correct parameters and return response content', async () => {
        openAIMockInstance.chat.completions.create.mockResolvedValue(fakeResponse);

        const result = await processPrompt(false, fakePrompt);

        expect(OpenAIMock).toHaveBeenCalledWith({
            baseURL: config.openRouterBaseUrl,
            apiKey: config.openRouterApiKey,
        });

        expect(openAIMockInstance.chat.completions.create).toHaveBeenCalledWith({
            model: config.openRouterModel,
            models: [`${config.openRouterFallbackModel1}`, `${config.openRouterFallbackModel2}`],
            messages: [
                { role: 'system', content: config.promptInstructions },
                { role: 'user', content: fakePrompt },
            ],
        });

        expect(result).toBe('Test response');
    });

    test('should return null if response content is null', async () => {
        const responseWithNullContent = {
            ...fakeResponse,
            choices: [
                {
                    ...fakeResponse.choices[0],
                    message: { role: 'assistant', content: null },
                },
            ],
        };
        openAIMockInstance.chat.completions.create.mockResolvedValue(responseWithNullContent);

        const result = await processPrompt(false, fakePrompt);

        expect(result).toBeNull();
    });

    test('should handle errors and log them', async () => {
        const fakeError = new Error('API error');
        openAIMockInstance.chat.completions.create.mockRejectedValue(fakeError);

        const result = await processPrompt(false, fakePrompt);

        expect(result).toBe(undefined);
    });

    test('should call OpenAI API with advice flag and return response content', async () => {
        openAIMockInstance.chat.completions.create.mockResolvedValue(fakeResponse);

        const result = await processPrompt(true);

        expect(OpenAIMock).toHaveBeenCalledWith({
            baseURL: config.openRouterBaseUrl,
            apiKey: config.openRouterApiKey,
        });

        expect(openAIMockInstance.chat.completions.create).toHaveBeenCalledWith({
            model: config.openRouterModel,
            messages: [
            { role: 'user', content: config.promptAdviceInstructions },
            ],
        });

        expect(result).toBe('Test response');
    });
});

