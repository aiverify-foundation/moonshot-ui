import nextJest from 'next/jest.js';
import type { Config } from 'jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/app/components/$1',
    '^@apptypes/(.*)$': '<rootDir>/app/types/$1',
    '^@views/(.*)$': '<rootDir>/app/views/$1',
    '^@app/lib/(.*)$': '<rootDir>/app/lib/$1',
    '^@api/(.*)$': '<rootDir>/app/api/$1',
    '^@redux/slices$': '<rootDir>/lib/redux/slices/index',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
