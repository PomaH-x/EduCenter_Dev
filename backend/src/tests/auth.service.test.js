// tests/unit/auth.service.test.js
const { validateTelegramSignature } = require('../../src/services/auth.service');

describe('Testing auth service', () => {
  it('should validate correct signature', () => {
    const signature = 'some_valid_signature'; // Допустим, это допустимая подпись
    expect(validateTelegramSignature(signature)).toBe(true);
  });

  it('should reject invalid signature', () => {
    const signature = 'invalid_signature';
    expect(validateTelegramSignature(signature)).toBe(false);
  });
});