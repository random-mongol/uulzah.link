/**
 * Gemini API utilities including key rotation and retry logic
 */

import type { GeminiConfig } from '@/lib/types/voice'
import { GoogleGenAI } from '@google/genai'

// Default configuration
const DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com'
const DEFAULT_MODEL = 'gemini-2.5-flash' // Supports audio input and structured outputs

/**
 * Parse and validate Gemini API keys from environment
 */
export function getGeminiConfigs(): GeminiConfig[] {
  const keysEnv = process.env.GEMINI_API_KEYS || ''
  const keys = keysEnv.split(',').map(k => k.trim()).filter(k => k.length > 0)

  if (keys.length === 0) {
    throw new Error('No Gemini API keys configured. Set GEMINI_API_KEYS in .env.local')
  }

  const baseUrl = process.env.GEMINI_BASE_URL || DEFAULT_BASE_URL
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL

  return keys.map(apiKey => ({
    apiKey,
    baseUrl,
    model,
  }))
}

/**
 * Simple in-memory index for round-robin key selection
 * In production, consider using Redis or a database for distributed systems
 */
let currentKeyIndex = 0

/**
 * Get the next Gemini configuration using round-robin rotation
 */
export function getNextGeminiConfig(configs: GeminiConfig[]): GeminiConfig {
  const config = configs[currentKeyIndex % configs.length]
  currentKeyIndex = (currentKeyIndex + 1) % configs.length
  return config
}

/**
 * Check if an error is a quota/rate limit error that should trigger retry
 */
export function isRetryableError(error: any): boolean {
  if (!error) return false

  const errorMessage = error.message?.toLowerCase() || ''
  const errorStatus = error.status || 0

  // Retry on quota exceeded, rate limit, or 429 errors
  return (
    errorStatus === 429 ||
    errorStatus === 403 ||
    errorMessage.includes('quota') ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('resource_exhausted')
  )
}

/**
 * Execute a function with automatic retry using different API keys on failure
 */
export async function withGeminiRetry<T>(
  fn: (config: GeminiConfig) => Promise<T>,
  maxRetries?: number
): Promise<T> {
  const configs = getGeminiConfigs()
  const attempts = maxRetries ?? configs.length // Default: try all keys once

  let lastError: Error | undefined

  for (let i = 0; i < attempts; i++) {
    const config = getNextGeminiConfig(configs)

    try {
      return await fn(config)
    } catch (error: any) {
      console.error(`Gemini API call failed with key ${i + 1}/${attempts}:`, error.message)
      lastError = error

      // If it's not a retryable error, fail immediately
      if (!isRetryableError(error)) {
        throw error
      }

      // Continue to next key if available
      if (i < attempts - 1) {
        console.log(`Retrying with next API key...`)
        continue
      }
    }
  }

  // All retries exhausted
  throw lastError || new Error('All Gemini API keys failed')
}

/**
 * Transcribe audio to text using Gemini API
 */
export async function transcribeAudio(
  config: GeminiConfig,
  audioData: string,
  mimeType: string,
  locale: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: config.apiKey })

  const prompt = locale === 'mn'
    ? 'Энэ аудио бичлэгийг Монгол хэл рүү бичвэрлэнэ үү. Зөвхөн хэлсэн үгсийг буцаана уу, нэмэлт тайлбар өгөх шаардлагагүй.'
    : 'Transcribe this audio in Mongolian to text. Return only the spoken words, no additional explanation.'

  const contents = [
    { text: prompt },
    {
      inlineData: {
        mimeType: mimeType,
        data: audioData,
      },
    },
  ]

  try {
    const response = await ai.models.generateContent({
      model: config.model,
      contents: contents,
      config: {
        temperature: 0.2,
      },
    })

    const textResponse = response.text

    if (!textResponse) {
      throw new Error('No transcription from Gemini API')
    }

    return textResponse.trim()
  } catch (error: any) {
    // Wrap error to ensure it has status/message for retry logic
    if (!error.status && error.response?.status) {
      error.status = error.response.status
    }
    throw error
  }
}

/**
 * Analyze transcribed text and extract structured meeting data using Gemini API
 */
export async function analyzeTranscription<T>(
  config: GeminiConfig,
  transcription: string,
  prompt: string,
  responseSchema: any
): Promise<T> {
  const ai = new GoogleGenAI({ apiKey: config.apiKey })

  const fullPrompt = `${prompt}

Transcribed text:
"""
${transcription}
"""

Extract the meeting information from this transcribed text and return it in the specified JSON format.`

  try {
    const response = await ai.models.generateContent({
      model: config.model,
      contents: [
        {
          parts: [
            {
              text: fullPrompt,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    })

    const textResponse = response.text

    if (!textResponse) {
      throw new Error('No response from Gemini API')
    }

    try {
      return JSON.parse(textResponse) as T
    } catch (err) {
      console.error('Failed to parse Gemini response:', textResponse)
      throw new Error('Invalid JSON response from Gemini')
    }
  } catch (error: any) {
    // Wrap error to ensure it has status/message for retry logic
    if (!error.status && error.response?.status) {
      error.status = error.response.status
    }
    throw error
  }
}
