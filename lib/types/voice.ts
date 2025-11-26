/**
 * Types for voice-to-meeting-data conversion using Gemini API
 */

/**
 * A possible date/time extracted from voice input
 */
export interface VoiceDateOption {
  /** Raw text as spoken by user (e.g., "маргааш орой", "дараа долоо хоногийн Мягмар") */
  rawText: string
  /** ISO date string in Asia/Tokyo timezone if it can be resolved (e.g., "2025-11-18") */
  isoDate: string | null
  /** Time range if specified (e.g., "18:00–20:00", "19:00") */
  timeRange: string | null
}

/**
 * Structured output from Gemini voice-to-meeting conversion
 */
export interface VoiceMeetingData {
  /** Meeting title extracted from voice input */
  title: string
  /** Meeting description if mentioned, otherwise null */
  description: string | null
  /** List of possible dates/times mentioned */
  possibleDates: VoiceDateOption[]
  /** Detailed and fun explanation of the analysis */
  explanation: string
}

/**
 * Request body for the voice-to-meeting API endpoint
 */
export interface VoiceToMeetingRequest {
  /** Base64-encoded audio data */
  audioData: string
  /** Audio MIME type (e.g., "audio/webm", "audio/mp4") */
  mimeType: string
  /** User's locale for context */
  locale: string
}

/**
 * Response from the voice-to-meeting API endpoint
 */
export interface VoiceToMeetingResponse {
  success: boolean
  data?: VoiceMeetingData
  transcription?: string // Transcribed text from audio
  error?: string
}

/**
 * Gemini API configuration
 */
export interface GeminiConfig {
  apiKey: string
  baseUrl: string
  model: string
}
