/**
 * WhatsApp Business API messaging rule:
 * Businesses can only initiate conversations with template messages.
 * After user replies, you can send other message types (text, media, etc)
 * within a 24-hour window.
 * Ref: https://developers.facebook.com/community/threads/651506520396074/
 */

import axios from 'axios';

import { wppAPIToken, ownNumberID } from '../../config'

interface apiResponse {
  success: boolean,
  data?: any,
  error?: any
}

export default async function sendReplyToWpp(message: string, userPhoneNumber: string ): Promise<apiResponse> {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${wppAPIToken}`
    }
  }

  const data = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": `${userPhoneNumber}`,
    "type": "text",
    "text": {
      "preview_url": true,
      "body": `${message}`
    }
  }

  const url = `https://graph.facebook.com/v22.0/${ownNumberID}/messages`;

  try {
    const response = await axios.post(url, data, options);
      return {
        success: true,
        data: response
      };
  } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err
      };
  }
}