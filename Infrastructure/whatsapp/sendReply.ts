import axios from 'axios';

export async function sendReply(to: string, text: string): Promise<void> {
  try {
    await axios.post(
      'https://graph.facebook.com/v19.0/your_phone_number_id/messages',
      {
        messaging_product: 'whatsapp',
        to,
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (err) {
    console.error('Error sending WhatsApp reply:', err);
  }
}