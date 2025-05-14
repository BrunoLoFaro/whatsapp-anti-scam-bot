import { Router } from 'express';

const router = Router();

router.get('/api/webhook', (req, res) => {
    /* handshake de subcripcion a eventos de mensaje. Se recibe: 
    {    
        hub.mode=subscribe&
        hub.challenge=1158201444&
        hub.verify_token=meatyhamhock
    } */
    
    console.log(req.query);
    res.status(200).send('bruh');
});


//router.post('/api/webhook', );

export default router;