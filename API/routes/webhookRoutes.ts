import { Router } from 'express';
import { handleIncomingMessage } from '../controllers/webhookController.js';

const router = Router();
router.post('/', handleIncomingMessage);

export default router;