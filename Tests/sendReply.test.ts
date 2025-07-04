import axios from 'axios';

import { describe, test, jest, afterEach, expect } from '@jest/globals'

import sendReplyToWpp from '../Infrastructure/whatsapp/sendReply';
import logger from '../Infrastructure/logging/logger.js';

jest.mock('axios');
jest.mock('../config.ts', () => ({
    wppAPIToken: 'fake-wpp-token',
    ownNumberID: '123456789'
}));

jest.mock('../Infrastructure/logging/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
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
        expect(mockedAxios.post).toBeCalledWith(`${config.metaBaseUrl}/v22.0/${config.ownNumberID}/messages`,
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
        expect(response).toEqual(mockData);
    });

    test('Debe fallar correctamente la API', async () => {

    const mockData = {
        success: false,
        error: {
            error: {
                message: "Unsupported post request. Example",
                type: "GraphMethodException Example",
                code: 100111,
                error_subcode: 3311,
                fbtrace_id: "AB8v5praKdgF2bWXoyU_diL123123123123"
            } 
        }
    };
    
    mockedAxios.post.mockRejectedValueOnce(mockData);

    const response = await sendReplyToWpp('mensaje fallido', "0011223344");

    //verificacion de respuesta de estado de API
    expect(response.success).toBe(false);

    //verificacion de correlacion de datos de API
    expect(response).toEqual(mockData);
    });

    test('Simula corte de internet al enviar mensaje', async () => {
        const networkError = new Error('Network Error');
        // Simula un error de red típico de axios
        (networkError as any).code = 'ENOTFOUND';
        (networkError as any).response = undefined;

        mockedAxios.post.mockRejectedValueOnce(networkError);

        const response = await sendReplyToWpp('mensaje', '0011223344');

        expect(response).toHaveProperty('message', 'Network Error');
        expect(response).not.toHaveProperty('success', true);
    });

    test('Simula error de timeout al enviar mensaje', async () => {
        const timeoutError = new Error('Timeout Error');
        // Simula un error de timeout típico de axios
        (timeoutError as any).code = 'ECONNABORTED';
        (timeoutError as any).response = undefined;

        mockedAxios.post.mockRejectedValueOnce(timeoutError);

        const response = await sendReplyToWpp('mensaje', '0011223344');

        expect(response).toHaveProperty('message', 'Timeout Error');
        expect(response).not.toHaveProperty('success', true);
    });
    
});
