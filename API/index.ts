import { Router } from 'express';
import webhookRoutes from './routes/webhookRoutes.js';

const router = Router();
router.use('/webhook', webhookRoutes);

export default router;
