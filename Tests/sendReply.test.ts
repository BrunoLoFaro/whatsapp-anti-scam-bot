import axios from 'axios';

import { describe, test, jest, beforeEach, afterEach, expect } from '@jest/globals'

import sendReplyToWpp from '../Infrastructure/whatsapp/sendReply';

jest.mock('axios');
jest.mock('../config.ts', () => ({
    wppAPIToken: 'fake-wpp-token',
    ownNumberID: '123456789'
}));

import { wppAPIToken, ownNumberID } from '../config';

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
            }
        }
        
        mockedAxios.post.mockResolvedValueOnce(mockData);

        const response = await sendReplyToWpp('test', "0011223344");
        
        //verificacion de argumentos correctos
        expect(mockedAxios.post).toBeCalledWith(`https://graph.facebook.com/v22.0/${ownNumberID}/messages`,
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
            'Authorization': `${wppAPIToken}`
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
        error: {
        }
    }
    
    mockedAxios.post.mockRejectedValueOnce(mockData);

    const response = await sendReplyToWpp('mensaje fallido', "0011223344");

    //verificacion de respuesta de estado de API
    expect(response.success).toBe(false);

    //verificacion de correlacion de datos de API
    expect(response.error).toEqual(mockData);
    });
});
