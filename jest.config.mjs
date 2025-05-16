/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Directorio donde están tus tests
  roots: ['<rootDir>/Tests'],
  
  // Mapeo de módulos (usando alias @/ si lo necesitas)
  moduleNameMapper: {
        '(.+)\\.js': '$1'
    },
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
  
  // Extensiones a manejar
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // Patrón para encontrar tests
  testMatch: ['**/*.test.ts']
};