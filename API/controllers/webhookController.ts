import { Request, Response } from 'express';
import { saveMessageUseCase } from '../../Application/usecases/saveMessageUseCase.js';

export async function handleIncomingMessage(req: Request, res: Response): Promise<void> {
  const { from, body } = req.body;

  if (!from || !body) {
    res.status(400).json({ error: 'Missing "from" or "body"' });
    return;
  }

  await saveMessageUseCase({ from, body });
  res.json({ message: 'Mensaje recibido. Estamos procesando...' });
}