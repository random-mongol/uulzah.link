/**
 * API route for converting voice input to structured meeting data
 * Uses Gemini API with audio understanding and structured outputs
 */

import { NextRequest, NextResponse } from 'next/server'
import type {
  VoiceToMeetingRequest,
  VoiceToMeetingResponse,
  VoiceMeetingData,
} from '@/lib/types/voice'
import { withGeminiRetry, transcribeAudio, analyzeTranscription } from '@/lib/utils/gemini'

// Maximum audio file size: 5MB
const MAX_AUDIO_SIZE = 5 * 1024 * 1024

/**
 * JSON Schema for Gemini structured output
 * This ensures the response matches our VoiceMeetingData type
 */
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'Meeting title extracted from the audio',
    },
    description: {
      type: ['string', 'null'],
      description: 'Meeting description or agenda if mentioned',
    },
    possibleDates: {
      type: 'array',
      description: 'List of possible dates/times mentioned',
      items: {
        type: 'object',
        properties: {
          rawText: {
            type: 'string',
            description: 'Original text as spoken by user (in Mongolian)',
          },
          isoDate: {
            type: ['string', 'null'],
            description: 'ISO date string (yyyy-MM-dd) if it can be resolved',
          },
          timeRange: {
            type: ['string', 'null'],
            description: 'Time range if specified (e.g., "18:00-20:00" or "19:00")',
          },
        },
        required: ['rawText', 'isoDate', 'timeRange'],
      },
    },
  },
  required: ['title', 'description', 'possibleDates'],
}

/**
 * Generate the prompt for Gemini based on user's locale
 */
function generatePrompt(locale: string): string {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const dayOfWeek = today.toLocaleDateString('mn-MN', { weekday: 'long' })

  if (locale === 'mn') {
    return `Та Монгол хэл дээрх аудио бичлэгийг боловсруулж, уулзалтын мэдээлэл гаргах ёстой.

Өнөөдөр: ${todayStr} (${dayOfWeek})
Цагийн бүс: Asia/Ulaanbaatar (UTC+8)

Ажил:
1. Уулзалтын гарчиг олох (жишээ: "Хамтрагчдын уулзалт", "Долоо хоногийн уулзалт")
2. Тайлбар эсвэл хэлэлцэх асуудал байвал гаргах
3. Дурдсан огноо болон цагийг олох (жишээ: "маргааш орой", "дараа долоо хоногийн Мягмар")

Огноо хувиргах заавар:
- "өнөөдөр" = ${todayStr}
- "маргааш" = өнөөдрөөс +1 өдөр
- "дараа долоо хоногийн [өдөр]" = дараагийн 7 хоног дотор тухайн өдөр
- "ирэх сарын [өдөр]" = дараах сар
- "орой" = 18:00-20:00
- "үдээс хойш" = 13:00-17:00

Бүх огноо ISO формат (yyyy-MM-dd) байх ёстой.
Цагийг 24 цагийн форматаар (HH:mm) эсвэл хугацаа (HH:mm-HH:mm) гаргах.

Хэрэв хэрэглэгч тодорхой огноо/цаг дурдаагүй бол possibleDates хоосон массив байна.`
  } else {
    return `You are processing audio in Mongolian language to extract meeting information.

Today: ${todayStr} (${dayOfWeek})
Timezone: Asia/Ulaanbaatar (UTC+8)

Tasks:
1. Extract the meeting title (e.g., "Team meeting", "Weekly sync")
2. Extract description or agenda if mentioned
3. Extract all mentioned dates and times (e.g., "tomorrow evening", "next Tuesday")

Date conversion rules:
- "өнөөдөр" (today) = ${todayStr}
- "маргааш" (tomorrow) = today +1 day
- "дараа долоо хоногийн [day]" (next [day]) = the next occurrence of that day within 7 days
- "ирэх сарын [date]" (next month [date]) = next month
- "орой" (evening) = 18:00-20:00
- "үдээс хойш" (afternoon) = 13:00-17:00

All dates must be in ISO format (yyyy-MM-dd).
Times should be in 24-hour format (HH:mm) or range (HH:mm-HH:mm).

If no specific dates/times are mentioned, possibleDates should be an empty array.`
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: VoiceToMeetingRequest = await request.json()
    const { audioData, mimeType, locale } = body

    // Validate inputs
    if (!audioData || !mimeType) {
      return NextResponse.json(
        { success: false, error: 'Missing audioData or mimeType' } as VoiceToMeetingResponse,
        { status: 400 }
      )
    }

    // Check audio size (base64 encoded, so actual size is ~3/4 of string length)
    const estimatedSize = (audioData.length * 3) / 4
    if (estimatedSize > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Audio file too large (max 5MB)' } as VoiceToMeetingResponse,
        { status: 400 }
      )
    }

    // Step 1: Transcribe audio to text
    console.log('Step 1: Transcribing audio...')
    const transcription = await withGeminiRetry<string>(async (config) => {
      return await transcribeAudio(config, audioData, mimeType, locale || 'mn')
    })
    console.log('Transcription:', transcription)

    // Step 2: Analyze transcribed text to extract structured data
    console.log('Step 2: Analyzing transcription...')
    const prompt = generatePrompt(locale || 'mn')
    const result = await withGeminiRetry<VoiceMeetingData>(async (config) => {
      return await analyzeTranscription<VoiceMeetingData>(
        config,
        transcription,
        prompt,
        RESPONSE_SCHEMA
      )
    })
    console.log('Analysis result:', result)

    // Return successful response with transcription
    return NextResponse.json({
      success: true,
      data: result,
      transcription,
    } as VoiceToMeetingResponse)
  } catch (error: any) {
    console.error('Voice-to-meeting API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process audio',
      } as VoiceToMeetingResponse,
      { status: 500 }
    )
  }
}
