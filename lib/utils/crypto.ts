/**
 * Generate a secure random token for edit/response access
 */
export function generateSecureToken(): string {
  const array = new Uint8Array(32)
  if (typeof window !== 'undefined') {
    crypto.getRandomValues(array)
  } else {
    // Node.js environment
    const crypto = require('crypto')
    crypto.randomFillSync(array)
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}
