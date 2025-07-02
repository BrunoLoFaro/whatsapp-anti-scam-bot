import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// 1. MOCK estático de config y logger (hoisted por Jest)
jest.mock('../config.js', () => ({
  __esModule: true,
  default: { redisUri: 'redis://localhost:6379' }
}));
jest.mock('../Infrastructure/logging/logger.js', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('Testeo de la conexión de Redis', () => {
  beforeEach(() => {
    // Limpia caché de módulos y resetea mocks para cada test
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('debería loguear éxito si la conexión es exitosa', async () => {
    // 2. Prepara tu cliente falso
    const mockRedisClient = {
      on: jest.fn(),
      connect: jest.fn().mockResolvedValue(undefined as never),
    };

    // 3. Mock “voraz” de redis justo antes de importar
    jest.doMock('redis', () => ({
      createClient: () => mockRedisClient
    }));

    // 4. Import dinámico del código bajo prueba
    const { connectRedis } = await import(
      '../Infrastructure/database/redisClient.js'
    );

    // 5. Recupera el mock de logger que realmente usará redisClient.js
    const { default: logger } = jest.requireMock(
      '../Infrastructure/logging/logger.js'
    ) as { default: { info: jest.Mock; error: jest.Mock } };

    // 6. Ejecuta y comprueba
    await connectRedis();
    expect(mockRedisClient.connect).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith('Conexion exitosa hacia la BD Redis');
    expect(logger.error).not.toHaveBeenCalled();
  });

  test('debería loguear un error y lanzar si falla la conexión', async () => {
    const connectionError = new Error('Connection failed');
    const mockRedisClient = {
      on: jest.fn(),
      connect: jest.fn().mockRejectedValue(connectionError as never),
    };

    jest.doMock('redis', () => ({
      createClient: () => mockRedisClient
    }));

    const { connectRedis } = await import(
      '../Infrastructure/database/redisClient.js'
    );

    const { default: logger } = jest.requireMock(
      '../Infrastructure/logging/logger.js'
    ) as { default: { info: jest.Mock; error: jest.Mock } };

    await expect(connectRedis()).rejects.toThrow(connectionError);
    expect(mockRedisClient.connect).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      `Hubo un error conectado el cliente de redis: ${connectionError}`
    );
    expect(logger.info).not.toHaveBeenCalled();
  });
});