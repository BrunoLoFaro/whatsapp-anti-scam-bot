/**
 * WhatsApp Business API messaging rule:
 * Businesses can only initiate conversations with template messages.
 * After user replies, you can send other message types (text, media, etc)
 * within a 24-hour window.
 * Ref: https://developers.facebook.com/community/threads/651506520396074/
 */

import axios from 'axios';
import logger from '../logging/logger.js';

import config from '../../config.js';


interface IapiResponse {
  success: boolean,
  data?: IdataResponse,
  error?: IerrorResponse
}

interface IerrorResponse {
  error: {
    message?: string,
    type?: string,
    code?: number,
    error_subcode?: number,
    fbtrace_id?: string
  }
}

interface IdataResponse {
  messaging_product: string,
  contacts: [
    {
      input: string,
      wa_id: string
    }
  ],
  messages: [
    {
      id: string
    }
  ]
}

export default async function sendReplyToWpp(message: string, userPhoneNumber: string ): Promise<IapiResponse> {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.wppAPIToken}`
    }
  }

  const userPhoneNumberSanitized: string = userPhoneNumber.replace(/^549/, '54');

  logger.info(`Not Sanitized phone number: ${userPhoneNumber}`);
  logger.info(`Sanitized phone number: ${userPhoneNumberSanitized}`);

  const data = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": `${userPhoneNumberSanitized}`,
    "type": "text",
    "text": {
      "preview_url": true,
      "body": `${message}`
    }
  }

  const url = `${config.baseUrl}/v22.0/${config.ownNumberID}/messages`;

  try {
    logger.info(`Sending a message to Meta API, for the number ${userPhoneNumberSanitized}...`);

    const response: IapiResponse = await axios.post(url, data, options);
    logger.info(`Succesfully sent a message to Meta API, for the number ${userPhoneNumberSanitized}`);
    
    return response;

  } catch (err: any) {
      logger.error(`Error occurred while trying to send a message to Meta API, for the number ${userPhoneNumberSanitized}`);
      const error = err.response ? err.response.data.error : err;
      logger.error ('Error Info: ' + JSON.stringify(error));
      console.error(error);
      return error as unknown as IapiResponse;
  }
}