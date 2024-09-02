import nextJest from 'next/jest.js';
import type { Config } from 'jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
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
    '!app/components/IconSVG/**',
    '!app/hooks/*',
  ],
  coverageProvider: 'v8',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  coverageReporters: ['html', 'text', 'json-summary'],
  reporters: ['default', ['jest-html-reporter', { pageTitle: 'Test Report' }]],
  testResultsProcessor: './node_modules/jest-json-reporter',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/app/components/(.*)$': '<rootDir>/app/components/$1',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
