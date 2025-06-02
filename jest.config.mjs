/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/Tests'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.json'
      }
    ]
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.test.ts'],
  
  // Elimina o modifica el moduleNameMapper
  moduleNameMapper: {
    // Solo mapea tus propios módulos si es necesario
    '^@/(.*)$': '<rootDir>/src/$1',
    // O mantén solo esto si necesitas el mapeo .js
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
};