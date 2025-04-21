// jest.config.js
module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'node',
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.spec.json',
      },
    },
    setupFiles: ['<rootDir>/src/tests/envSetup.js'], // Сюда добавим код для загрузки .env
  };