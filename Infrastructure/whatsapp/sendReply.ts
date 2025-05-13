import axios from 'axios';

import { wppAPIToken, ownNumberID } from '../../config.js'

interface apiResponse {
  success: boolean,
  data?: any,
  error?: any
}

export default async function sendReplyToWpp(message: string, userPhoneNumber: number ): Promise<apiResponse> {
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