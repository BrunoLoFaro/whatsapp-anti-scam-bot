import { Router } from 'express';
import config from '../../config.js';

const router = Router();

interface urlQuery {
    'hub.mode': string,
    'hub.challenge': number,
    'hub.verify_token': string
}

router.get('/api/webhook', function(req, res) {
    /* handshake de subcripcion a eventos de mensaje. Se recibe como URL Query: 
    {    
        hub.mode=subscribe&
        hub.challenge=1158201444&
        hub.verify_token=meatyhamhock
    } */

    const query = req.query as unknown as urlQuery;
    const mode: string = query['hub.mode'];
    const challenge: number = query['hub.challenge'];
    const verifyToken: string = query['hub.verify_token'];

    if (!challenge || !verifyToken || !mode){
        res.status(400).json({ error: 'Parametros Incorrectos' });
    }
    
    if (verifyToken !== config.wppOwnWebhookToken){
        res.status(401).json({ error: 'Token Incorrecto' });
    }

    res.status(200).send(challenge);            

});


router.post('/api/webhook', function(req, res) {
    console.log(req);
});

export default router;