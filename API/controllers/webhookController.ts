import { Request, Response } from 'express';
import { saveMessageUseCase } from '../../Application/usecases/saveMessageUseCase.js';

export async function exampleHandler(req: Request, res: Response): Promise<void> {
  res.json({ message: 'Este es un endpoint de prueba!' });//test endpoint as example
}

export async function handleIncomingMessage(req: Request, res: Response): Promise<void> {
  const { from, body } = req.body;

  if (!from || !body) {
    res.status(400).json({ error: 'Missing "from" or "body"' });//validation
    return;
  }

  await saveMessageUseCase({ from, body });//execute use case
  res.json({ message: 'Mensaje recibido. Estamos procesando...' });
}