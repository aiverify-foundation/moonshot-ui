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
  prettierPath: require.resolve('prettier-2'),
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/api/**',
    '!app/services/**',
    '!**/node_modules/**',
    '!**/page.tsx',
    '!**/layout.tsx',
    '!**/error.tsx',
    '!**/loading.tsx',
    '!**/not-found.tsx',
    '!**/global.d.ts',
    '!app/components/chat.tsx',
    '!app/components/window.tsx',
    '!app/hooks/**',
  ],
  coverageReporters: ['text', 'text-summary'],
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
