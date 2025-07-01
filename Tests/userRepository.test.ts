import { UserRepository, UserState, userField } from '../Infrastructure/database/userRepository.js';
import redisClient from '../Infrastructure/database/redisClient.js';
import config from '../config.js';
import { describe, test, jest, expect, beforeEach } from '@jest/globals';

// Mock del cliente Redis. La clave es usar __esModule y default para mockear un default export.
jest.mock('../Infrastructure/database/redisClient', () => ({
  __esModule: true,
  default: {
    hSet: jest.fn(),
    expire: jest.fn(),
    del: jest.fn(),
    hGet: jest.fn(),
  }
}));

// Mock del logger, aunque no se use directamente en el repositorio, es una buena práctica
jest.mock('../Infrastructure/logging/logger');
jest.mock('../config', () => ({
    redisUri: 'redis://localhost:6379',
}));


// Creamos un alias tipado para el cliente mockeado
const mockRedisClient = redisClient as jest.Mocked<typeof redisClient>;

describe('UserRepository', () => {
    let userRepository: UserRepository;
    const testUser: userField = {
        phoneNumber: '123456789',
        state: UserState.GREETED,
        receivedMessage: 'Test message'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Obtenemos una nueva instancia para cada test para asegurar el aislamiento
        // (Aunque sea un singleton, en los tests es bueno resetear su estado si lo tuviera)
        userRepository = UserRepository.getInstance();
    });

    test('debería implementar el patrón singleton correctamente', () => {
        const instance1 = UserRepository.getInstance();
        const instance2 = UserRepository.getInstance();
        
        expect(instance1).toBe(instance2);
        expect(instance1).toBeInstanceOf(UserRepository);
    });

    test('debería crear un usuario con estado por defecto', async () => {
        const userWithoutState: userField = {
            phoneNumber: '123456789'
        };

        await userRepository.createUser(userWithoutState);

        expect(mockRedisClient.hSet).toHaveBeenCalledWith('user:123456789', {
            state: UserState.NEW
        });
        expect(mockRedisClient.expire).toHaveBeenCalledWith('user:123456789', 300);
    });

    test('debería crear un usuario con estado específico', async () => {
        await userRepository.createUser(testUser);

        expect(mockRedisClient.hSet).toHaveBeenCalledWith('user:123456789', {
            state: UserState.GREETED
        });
        expect(mockRedisClient.expire).toHaveBeenCalledWith('user:123456789', 300);
    });

    test('debería actualizar un usuario con mensaje', async () => {
        await userRepository.updateUser(testUser);

        expect(mockRedisClient.hSet).toHaveBeenCalledWith('user:123456789', {
            state: UserState.GREETED,
            message: 'Test message'
        });
    });

    test('debería retornar sin hacer nada si no hay mensaje al actualizar', async () => {
        const userWithoutMessage: userField = {
            phoneNumber: '123456789',
            state: UserState.GREETED
        };

        await userRepository.updateUser(userWithoutMessage);

        expect(mockRedisClient.hSet).not.toHaveBeenCalled();
    });

    test('debería eliminar un usuario', async () => {
        await userRepository.deleteUser(testUser);

        expect(mockRedisClient.del).toHaveBeenCalledWith('user:123456789');
    });

    test('debería recuperar el estado de un usuario', async () => {
        mockRedisClient.hGet.mockResolvedValue('GREETED');

        const result = await userRepository.retrieveUserState('123456789');

        expect(mockRedisClient.hGet).toHaveBeenCalledWith('user:123456789', 'state');
        expect(result).toBe('GREETED');
    });

    test('debería retornar null si el usuario no existe', async () => {
        mockRedisClient.hGet.mockResolvedValue(null);

        const result = await userRepository.retrieveUserState('nonexistent');

        expect(result).toBeNull();
    });

    test('debería recuperar el mensaje recibido de un usuario', async () => {
        mockRedisClient.hGet.mockResolvedValue('Test message');

        const result = await userRepository.retrieveUserReceivedMessage('123456789');

        expect(mockRedisClient.hGet).toHaveBeenCalledWith('user:123456789', 'message');
        expect(result).toBe('Test message');
    });

    test('debería retornar null si no hay mensaje guardado', async () => {
        mockRedisClient.hGet.mockResolvedValue(null);

        const result = await userRepository.retrieveUserReceivedMessage('123456789');

        expect(result).toBeNull();
    });
});