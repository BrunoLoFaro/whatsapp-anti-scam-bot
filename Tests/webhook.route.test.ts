import request from 'supertest';
import express from 'express';
import router from '../API/routes/webhook.route'; // Ajusta la ruta
import config from '../config.js';
import handleIncomingMessage from '../API/handlers/messageReceivedHandler';

import logger from '../Infrastructure/logging/logger';

import { describe, test, jest, expect } from '@jest/globals'

jest.mock('../config', () => ({
    wppAPIToken: 'fake-wpp-token',
    wppOwnWebhookToken: 'another-fake-token'
}));

jest.mock('../API/handlers/messageReceivedHandler', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../logging/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

const apiServer = express();
apiServer.use(express.json());
apiServer.use(router);

describe('Webhook Router TEST', function() {
    describe('GET /api/webhook route tests', function() {

        test('Missing parameters test', async function() {
            const response = await request(apiServer).get('/api/webhook').query({});

            expect(response.status).toBe(400);
        });

        test('Invalid token test', async function() {
            const response = await request(apiServer).get('/api/webhook').query({
                'hub.mode': 'subscribe',
                'hub.challenge': '123',
                'hub.verify_token': 'invalid token'
            });

            expect(response.status).toBe(401);
        });

        test('Correct parameters and token match - Response test', async function() {
                const response = await request(apiServer).get('/api/webhook').query({
                'hub.mode': 'subscribe',
                'hub.challenge': 123,
                'hub.verify_token': `${config.wppOwnWebhookToken}`
            }).send('123');

            expect(response.status).toBe(200);
            expect(response.text).toEqual('123');
        });
    });

    describe('POST /api/webhook route tests', function() {
        const mockMessageEntry = {
        entry: [{
            id: "0",
            changes: [{
            field: "messages",
            value: {
                messaging_product: "whatsapp",
                metadata: {
                display_phone_number: "16505551111",
                phone_number_id: "123456123"
                },
                contacts: [{
                profile: { name: "test user" },
                wa_id: "16315551181"
                }],
                messages: [{
                from: "16315551181",
                id: "ABGGFlA5Fpa",
                timestamp: "1504902988",
                type: "text",
                text: { body: "test message" }
                }]
            }
            }]
        }]
        };

        const mockStatusEntry = {
        entry: [{
            id: "0",
            changes: [{
            field: "messages",
            value: {
                messaging_product: "whatsapp",
                metadata: {
                display_phone_number: "16505551111",
                phone_number_id: "123456123"
                },
                statuses: [{
                id: "ABGGFlA5Fpa",
                status: "delivered",
                timestamp: "1504902988",
                recipient_id: "16315551181"
                }]
            }
            }]
        }]
        };

        const invalidChanges = {
            entry: [{
            id: "0",
            }]
        };


        test('Mising entry array test - Bad Parameters', async function() {
            const response = await request(apiServer).post('/api/webhook').send({ });
            
            expect(response.status).toBe(400);
        });

        test('Mising changes array in  entry array test - Bad Parameters', async function() {
            const response = await request(apiServer).post('/api/webhook').send(invalidChanges);
            
            expect(response.status).toBe(400);
        });

        test('Good Parameters - Message Test', async function() {
            const response = await request(apiServer).post('/api/webhook').send(mockMessageEntry);
            
            expect(handleIncomingMessage).toHaveBeenCalledWith(mockMessageEntry.entry[0].changes[0].value.messages[0]);
            expect(response.status).toBe(200);
            
        });

        test('Good Parameters - Status Test', async function() {
            const response = await request(apiServer).post('/api/webhook').send(mockStatusEntry);

            expect(response.status).toBe(200);
        });
    });
});