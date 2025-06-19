import request from 'supertest';
import express from 'express';
import fs from 'fs';
import router from '../API/routes/info.health.route';

import { describe, test, jest, expect, afterEach } from '@jest/globals'

jest.mock('fs');
jest.mock('../Infrastructure/logging/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

const app = express();
app.use(router);

describe('info.health.route', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/health', () => {
        test('should return health info with dependencies from package.json', async () => {
            const fakePackageJson = {
                dependencies: {
                    express: "^4.17.1",
                    jest: "^29.0.0"
                }
            };
            
            (fs.readFileSync as jest.Mock).mockImplementation((...args: unknown[]) => {
                const filePath = args[0] as string;
                if (filePath.endsWith('package.json')) {
                    return JSON.stringify(fakePackageJson);
                }
                throw new Error('File not found');
            });

            const res = await request(app).get('/api/health');
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('Ok');
            expect(res.body.dependencies).toEqual(fakePackageJson.dependencies);
            expect(res.body).toHaveProperty('timestamp');
            expect(res.body).toHaveProperty('version');
            expect(res.body.message).toBe('API running');
        });

        test('should handle error when reading package.json', async () => {
            (fs.readFileSync as jest.Mock).mockImplementation(() => {
                throw new Error('Cannot read file');
            });

            const res = await request(app).get('/api/health');
            expect(res.status).toBe(200);
            expect(res.body.dependencies).toEqual({ error: 'No se pudieron obtener las dependencias' });
        });
    });

    describe('GET /', () => {
        test('should return README.md content as markdown', async () => {
            const fakeReadme = '# My API\nSome documentation.';
            ((fs.readFile as unknown) as jest.Mock).mockImplementation((filePath, encoding, cb) => {
                if (typeof filePath === 'string' && filePath.endsWith('README.md')) {
                    (cb as (err: NodeJS.ErrnoException | null, data?: string) => void)(null, fakeReadme);
                } else {
                    (cb as (err: NodeJS.ErrnoException | null, data?: string) => void)(new Error('File not found'));
                }
            });

            const res = await request(app).get('/');
            expect(res.status).toBe(200);
            expect(res.type).toBe('text/markdown');
            expect(res.text).toBe(fakeReadme);
        });

        test('should handle error when reading README.md', async () => {
            ((fs.readFile as unknown) as jest.Mock).mockImplementation((filePath, encoding, cb) => {
                (cb as (err: Error | null, data?: string) => void)(new Error('Cannot read file'));
            });

            const res = await request(app).get('/');
            expect(res.status).toBe(500);
            expect(res.text).toBe('No se pudo cargar la documentación.');
        });
    });
});