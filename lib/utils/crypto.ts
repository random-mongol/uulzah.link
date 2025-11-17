/**
 * Generate a secure random token for edit/response access
 * Uses alphanumeric characters (a-z, A-Z, 0-9) = 62 possible characters
 * 12 characters = 62^12 = ~3.2 quadrillion possibilities
 */
export function generateSecureToken(): string {
  const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const TOKEN_LENGTH = 12
  let token = ''

  if (typeof window !== 'undefined') {
    const array = new Uint8Array(TOKEN_LENGTH)
    crypto.getRandomValues(array)
    for (let i = 0; i < TOKEN_LENGTH; i++) {
      token += ALPHABET[array[i] % ALPHABET.length]
    }
  } else {
    // Node.js environment
    const crypto = require('crypto')
    const array = new Uint8Array(TOKEN_LENGTH)
    crypto.randomFillSync(array)
    for (let i = 0; i < TOKEN_LENGTH; i++) {
      token += ALPHABET[array[i] % ALPHABET.length]
    }
  }

  return token
}
