import { Router } from 'express';
import { exampleHandler, handleIncomingMessage } from '../controllers/webhookController.js';

const router = Router();
router.get('/', exampleHandler);
router.post('/', handleIncomingMessage);

export default router;