import axios from 'axios';

import { describe, test, jest, afterEach, expect } from '@jest/globals'

import sendReplyToWpp from '../Infrastructure/whatsapp/sendReply';

jest.mock('axios');
jest.mock('../config.ts', () => ({
    wppAPIToken: 'fake-wpp-token',
    ownNumberID: '123456789'
}));

import config from '../config';

describe('Probando Respuesta a la API de WhatsApp', () => {

    afterEach(() => {
        jest.clearAllMocks();
    })

    //necesario por TS para autocompletado en axios.metodos
    const mockedAxios = axios as jest.Mocked<typeof axios>; 

    test('Debe enviar un mensaje correctamente a la API', async () => {

        const mockData = {
        success: true,
        data: {
            messaging_product: "whatsapp",
            contacts: [{
                input: "5491168851162",
                wa_id: "5491168851162"
            }],
            messages: [{
                id: "wamid.HBgNNTQ5MTE2ODg1MTE2MhUCABEYEkI4OEFFMjlEOEUyRjBDNjMyQgA="
            }]
        }
    };
        
        mockedAxios.post.mockResolvedValueOnce(mockData);

        const response = await sendReplyToWpp('test', "0011223344");
        
        //verificacion de argumentos correctos
        expect(mockedAxios.post).toBeCalledWith(`${config.baseUrl}/v22.0/${config.ownNumberID}/messages`,
        {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": "0011223344",
            "type": "text",
            "text": {
                "preview_url": true,
                "body": "test"
            }
        },
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.wppAPIToken}`
        }
        });

        //verificacion de respuesta de estado de API
        expect(response.success).toBe(true);

        //verificacion de correlacion de datos de API
        expect(response.data).toEqual(mockData);
    });

    test('Debe fallar correctamente la API', async () => {

    const mockData = {
        success: false,
        response: {
            data: {
                error: {
                    message: "Unsupported post request. Example",
                    type: "GraphMethodException Example",
                    code: 100111,
                    error_subcode: 3311,
                    fbtrace_id: "AB8v5praKdgF2bWXoyU_diL123123123123"
                }
            }
        }
    };
    
    mockedAxios.post.mockRejectedValueOnce(mockData);

    const response = await sendReplyToWpp('mensaje fallido', "0011223344");

    //verificacion de respuesta de estado de API
    expect(response.success).toBe(false);

    //verificacion de correlacion de datos de API
    expect(response.error).toEqual(mockData);
    });
});
