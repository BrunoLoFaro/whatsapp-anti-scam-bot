import { Router } from 'express';
import { handleIncomingMessage } from '../controllers/webhookController.js';

const router = Router();
router.get('/', handleIncomingMessage);

export default router;