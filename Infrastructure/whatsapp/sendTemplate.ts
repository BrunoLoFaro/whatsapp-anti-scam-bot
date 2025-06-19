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
  success: boolean,
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

export default async function sendUserTemplate(template: string, userPhoneNumber: string): Promise<IapiResponse | IerrorResponse> {
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

  let data = null;

  switch (template) {
    case config.midFlowTemplateFlowName:
      data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": `${userPhoneNumberSanitized}`,
        "type": "template",
        "template": {
          "name": `${template}`,
          "language": {
            "code": "es_AR"
          },
          "components": [
            {
              "type": "button",
              "sub_type": "quick_reply",
              "index": "0",
              "parameters": [
                { "type": "payload", "payload": "ADVICE_BUTTON" }
              ]
            },
            {
              "type": "button",
              "sub_type": "quick_reply",
              "index": "1",
              "parameters": [
                { "type": "payload", "payload": "SHARE_BUTTON" }
              ]
            },
            {
              "type": "button",
              "sub_type": "quick_reply",
              "index": "2",
              "parameters": [
                { "type": "payload", "payload": "TERMINATE_BUTTON" }
              ]
            }
          ]
        }
      };
      break;
    case config.greetTemplateFlowName:
      data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": `${userPhoneNumberSanitized}`,
        "type": "template",
        "template": {
          "name": `${template}`,
          "language": {
            "code": "es_AR"
          }
        }
      };
      break;
    case config.shareFlowTemplateFlowName:
      data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": `${userPhoneNumberSanitized}`,
        "type": "template",
        "template": {
          "name": `${template}`,
          "language": {
        "code": "es_AR"
          },
          "components": [
        {
          "type": "body",
          "parameters": [
            {
          "type": "text",
          "parameter_name": "sus_message",
          "text": "el mensaje sospechoso o lo que sea"
            }
          ]
        }
          ]
        }
      };
      break;
    default:
      data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": `${userPhoneNumberSanitized}`,
        "type": "template",
        "template": {
          "name": `${template}`,
          "language": {
            "code": "es_AR"
          }
        }
      };
      break;
  }

  const url = `${config.metaBaseUrl}/v22.0/${config.ownNumberID}/messages`;

  try {
    logger.info(`Sending a message flow template: ${template} to Meta API, for the number ${userPhoneNumberSanitized}... with ${JSON.stringify(data)}`);

    const response: IapiResponse = await axios.post(url, data, options);
    logger.info(`Successfully sent a message flow template: ${template} to Meta API, for the number ${userPhoneNumberSanitized}`);
    
    return response;

  } catch (err: any) {
      logger.error(`Error occurred while trying to send a message flow template: ${template} to Meta API, for the number ${userPhoneNumberSanitized}`);
      const error = err.response ? err.response.data.error : err;
      logger.error ('Error Info: ' + JSON.stringify(error));
      console.error(error);
      return error as IerrorResponse;
  }
}