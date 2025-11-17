/**
 * Generates a short, URL-friendly ID
 * Uses alphanumeric characters (a-z, A-Z, 0-9) = 62 possible characters
 * 7 characters = 62^7 = ~3.5 trillion possibilities
 * 8 characters = 62^8 = ~218 trillion possibilities
 */

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const ID_LENGTH = 8

/**
 * Generate a random short ID for events
 * @param length - Length of the ID (default: 8)
 * @returns Random alphanumeric string
 */
export function generateShortId(length: number = ID_LENGTH): string {
  let id = ''

  if (typeof window !== 'undefined') {
    // Browser environment
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      id += ALPHABET[array[i] % ALPHABET.length]
    }
  } else {
    // Node.js environment
    const crypto = require('crypto')
    const array = new Uint8Array(length)
    crypto.randomFillSync(array)
    for (let i = 0; i < length; i++) {
      id += ALPHABET[array[i] % ALPHABET.length]
    }
  }

  return id
}

/**
 * Validate if a string is a valid short ID
 * @param id - ID to validate
 * @returns true if valid
 */
export function isValidShortId(id: string): boolean {
  if (!id || id.length < 7 || id.length > 10) return false
  return /^[0-9A-Za-z]+$/.test(id)
}
