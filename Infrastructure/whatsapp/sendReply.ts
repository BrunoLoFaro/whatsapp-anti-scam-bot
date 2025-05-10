import axios from 'axios';
import logger from '../../Infrastructure/logging/logger.js';

export async function sendReply(to: string, text: string): Promise<void> {
  try {
/*    await axios.post(//TODO integrate with meta API
    );*/
  } catch (err) {
    logger.info('Error sending WhatsApp reply:', err);
  }
}