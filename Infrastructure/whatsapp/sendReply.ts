import axios from 'axios';

import { wppAPIToken } from '../../config.js'

export default async function sendReplyToWpp(ownPhoneNumberID: string, message: string, userPhoneNumber: string ){
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

  const url = `https://graph.facebook.com/${ownPhoneNumberID}/messages`

  try {
    const response = await axios.post(url, data, options);
      return response
  } catch (err) {
      console.error(err);
      return null;
  }
}