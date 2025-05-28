import { Router } from 'express';
import config from '../../config.js';
import logger from '../../Infrastructure/logging/logger.js';

import handleIncomingMessage from '../handlers/messageReceivedHandler.js';

const router = Router();

interface IurlQuery {
    'hub.mode': string,
    'hub.challenge': number,
    'hub.verify_token': string
}

interface IWhatsAppWebhook {
  entry: [{
    id: string; // "0"
    changes: Array<{
      field: "messages"; // Siempre "messages" en este contexto
      value: {
        messaging_product: "whatsapp"; // Siempre "whatsapp"
        metadata: {
          display_phone_number: string; // Ej: "16505551111"
          phone_number_id: string; // ID de número de teléfono de negocio (Ej: "123456123")
        };
        contacts: Array<{
          profile: {
            name: string; // Nombre del usuario (Ej: "test user name")
          };
          wa_id: string; // Número de WhatsApp del usuario (Ej: "16315551181")
        }>;
        messages: Array<{
          from: string; // Número remitente (debe coincidir con wa_id)
          id: string; // ID único del mensaje (Ej: "ABGGFlA5Fpa")
          timestamp: string; // Unix timestamp (Ej: "1504902988")
          type: "text"; // Puede ser también "image", "audio", etc.
          text?: {
            body: string; // Contenido del mensaje (Ej: "this is a text message")
          };
          // Otros tipos de mensaje (opcional):
          image?: {
            id: string;
            caption?: string;
          };
          // ... otros tipos (audio, document, etc.)
        }>;
      };
    }>;
  }];
}

router.get('/api/webhook', function(req, res) {
    /* handshake de subcripcion a eventos de mensaje. Se recibe como URL Query: 
    {    
        hub.mode=subscribe&
        hub.challenge=1158201444&
        hub.verify_token=meatyhamhock
    } */

    const query = req.query as unknown as IurlQuery;
    const mode: string = query['hub.mode'];
    const challenge: number = query['hub.challenge'];
    const verifyToken: string = query['hub.verify_token'];

    if (!challenge || !verifyToken || !mode){
        res.status(400).json({ error: 'Parametros No Definidos' });
        logger.error(`Parametros No Definidos: ${JSON.stringify(req.query)}`);
    }
    
    if (verifyToken !== config.wppOwnWebhookToken){
        res.status(401).json({ error: 'Token Incorrecto' });
        logger.error(`Token Incorrecto: ${verifyToken}`);
    }

    res.status(200).send(challenge);
    return;            

});


router.post('/api/webhook', function(req, res) {
    req.body as IWhatsAppWebhook;
    const { entry } = req.body;
    
    if (!entry || entry.length === 0) {
        res.status(400).send();
        logger.error('Webhook entry is empty or undefined' + JSON.stringify(req.body));
    }
    
    if (!entry[0].changes || entry[0].changes.length === 0){
        res.status(400).send();
        logger.error('Webhook changes are empty or undefined' + JSON.stringify(req.body));
    }
    
    const message = entry[0].changes[0].value.messages ? entry[0].changes[0].value.messages[0] : null;
    const status = entry[0].changes[0].value.statuses ?  entry[0].changes[0].value.statuses[0] : null;

    if (message){
        res.status(200).send();
        logger.info(`Mensaje recibido: ${JSON.stringify(message)}`);
        handleIncomingMessage(message);
    }

    if (status){
        res.status(200).send();
        logger.info(`Estado recibido: ${JSON.stringify(status)}`);
        //handleIncomingStatus
    }

    res.status(401).send();

});

export default router;