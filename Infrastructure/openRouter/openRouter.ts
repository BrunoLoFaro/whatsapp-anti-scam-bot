import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import config from '../../config.js';
import logger from '../logging/logger.js';

const openai = new OpenAI({
  baseURL: `${config.openRouterBaseUrl}`,
  apiKey: `${config.openRouterApiKey}`,
});

interface ChatCompletionMessage {
  role: string;
  content: string | null;
}

interface ChatCompletionChoice {
  index: number;
  message: ChatCompletionMessage;
  finish_reason: string;
}

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}


export default async function processPrompt(advice: boolean, prompt?: string, ): Promise<string | null> {
  // This function demonstrates how to use the OpenAI API to process a prompt 
  // and return the response from the model
  let message: ChatCompletionMessageParam[] = [];

  logger.info(`Using model: ${config.openRouterModel} and Fallbacks: ${config.openRouterFallbackModel1}, ${config.openRouterFallbackModel2}`);
  
  if (advice){
    logger.info(`Asking model for Phishing Advice: ${advice}`);

    message = [
      {
        role: 'user',
        content: `${config.promptAdviceInstructions}`,        
      }
    ]

  } else {

    logger.info(`... Processing prompt: ${prompt}`);

    message = [      
      {
        role: 'system',
        content: `${config.promptInstructions}`,
      },
      {
        role: 'user',
        content: `${prompt}`,
      },
    ]
  }

  try {
    const completion: OpenRouterResponse = await openai.chat.completions.create({
      model: `${config.openRouterModel}`,
      messages: message,
      // @ts-expect-error -- no existe models como propiedad de la interfaz de openAi
      models: [`${config.openRouterFallbackModel1}`, `${config.openRouterFallbackModel2}`],
    });

  logger.info(`Received response from model: ${completion?.choices?.[0]?.message?.content ?? 'No content'}`);

  return completion?.choices?.[0]?.message?.content ?? null;

  } catch (error) {
    logger.error(`Error processing prompt: ${JSON.stringify(error)}`);
    return JSON.stringify(error);
  }

}


