/**
 * Generate a browser fingerprint based on device characteristics
 * This creates a unique identifier for the device/browser combination
 */
export function generateFingerprint(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  const components = [
    // User agent
    navigator.userAgent,

    // Screen resolution
    `${window.screen.width}x${window.screen.height}`,
    `${window.screen.colorDepth}`,

    // Timezone
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    new Date().getTimezoneOffset().toString(),

    // Language
    navigator.language,

    // Platform
    navigator.platform,

    // Hardware concurrency (number of CPU cores)
    navigator.hardwareConcurrency?.toString() || '',

    // Device memory (if available)
    (navigator as any).deviceMemory?.toString() || '',
  ]

  // Combine all components
  const fingerprint = components.join('|')

  // Create a simple hash
  return hashString(fingerprint)
}

/**
 * Simple hash function for strings
 */
function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Check if the current browser matches a stored fingerprint
 */
export function verifyFingerprint(storedFingerprint: string): boolean {
  const currentFingerprint = generateFingerprint()
  return currentFingerprint === storedFingerprint
}

/**
 * Get a human-readable description of the device
 */
export function getDeviceDescription(): string {
  if (typeof window === 'undefined') {
    return 'Unknown device'
  }

  const ua = navigator.userAgent

  // Detect OS
  let os = 'Unknown OS'
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

  // Detect Browser
  let browser = 'Unknown Browser'
  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('Edg')) browser = 'Edge'
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera'

  return `${browser} on ${os}`
}
