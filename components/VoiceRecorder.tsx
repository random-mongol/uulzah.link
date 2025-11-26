'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { VoiceRecordingModal } from '@/components/VoiceRecordingModal'
import { t, Locale } from '@/lib/i18n/translations'
import type { VoiceMeetingData } from '@/lib/types/voice'

interface VoiceRecorderProps {
  locale: Locale
  onResult: (data: VoiceMeetingData, transcription: string) => void
  onError: (error: string) => void
  maxDuration?: number // in seconds
}

type RecordingState = 'idle' | 'recording' | 'transcribing' | 'analyzing'

export function VoiceRecorder({
  locale,
  onResult,
  onError,
  maxDuration = 30,
}: VoiceRecorderProps) {
  const [state, setState] = useState<RecordingState>('idle')
  const [timeLeft, setTimeLeft] = useState(maxDuration)
  const [isSupported, setIsSupported] = useState(true)
  const [transcription, setTranscription] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  // Check browser support on mount
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Create audio context and analyser for waveform
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      // Determine the best MIME type supported by the browser
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg',
        'audio/wav',
      ]
      const supportedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type))

      if (!supportedMimeType) {
        throw new Error('No supported audio format found')
      }

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: supportedMimeType,
      })

      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())

        // Close audio context
        if (audioContextRef.current) {
          audioContextRef.current.close()
          audioContextRef.current = null
        }

        // Process the recorded audio
        await processAudio()
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder

      setState('recording')
      setTimeLeft(maxDuration)

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err: any) {
      console.error('Failed to start recording:', err)

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        onError(t('event.form.voicePermissionDenied', locale))
      } else {
        onError(t('event.form.voiceError', locale))
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const processAudio = async () => {
    try {
      // Show transcribing state
      setState('transcribing')
      setTranscription('')

      // Create blob from chunks
      const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm'
      const audioBlob = new Blob(chunksRef.current, { type: mimeType })

      // Convert to base64
      const base64Audio = await blobToBase64(audioBlob)

      // Send to API
      const response = await fetch('/api/voice-to-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioData: base64Audio,
          mimeType,
          locale,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to process audio')
      }

      // Show transcription
      if (data.transcription) {
        setTranscription(data.transcription)
      }

      // Show analyzing state
      setState('analyzing')

      // Small delay to show the analyzing state
      await new Promise(resolve => setTimeout(resolve, 500))

      // Success!
      onResult(data.data, data.transcription || '')
    } catch (err: any) {
      console.error('Failed to process audio:', err)
      onError(err.message || t('event.form.voiceError', locale))
    } finally {
      setState('idle')
      chunksRef.current = []
      setTranscription('')
    }
  }

  const handleStart = () => {
    startRecording()
  }

  const handleFinish = () => {
    stopRecording()
  }

  const handleCancel = () => {
    stopRecording()
    setState('idle')
    chunksRef.current = []
    setTranscription('')
  }

  if (!isSupported) {
    return (
      <div className="text-sm text-gray-500">
        {t('event.form.voiceNotSupported', locale)}
      </div>
    )
  }

  return (
    <>
      {/* Start button */}
      {state === 'idle' && (
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleStart}
          className="w-full"
        >
          <Mic className="w-5 h-5" />
          {t('event.form.voiceInput', locale)}
        </Button>
      )}

      {/* Full-screen recording modal */}
      <VoiceRecordingModal
        isOpen={state === 'recording'}
        locale={locale}
        timeLeft={timeLeft}
        maxDuration={maxDuration}
        analyser={analyserRef.current}
        onFinish={handleFinish}
        onCancel={handleCancel}
      />

      {/* Processing overlay */}
      {(state === 'transcribing' || state === 'analyzing') && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-md flex flex-col items-center gap-6">
            {/* Status */}
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {state === 'transcribing'
                  ? (locale === 'mn' ? 'Бичвэрлэж байна...' : 'Transcribing...')
                  : (locale === 'mn' ? 'Шинжилж байна...' : 'Analyzing...')}
              </h2>
              <p className="text-gray-600">
                {state === 'transcribing'
                  ? (locale === 'mn'
                      ? 'Таны дууг текст болгож байна'
                      : 'Converting your voice to text')
                  : (locale === 'mn'
                      ? 'Уулзалтын мэдээлэл задалж байна'
                      : 'Extracting meeting information')}
              </p>
            </div>

            {/* Transcription preview */}
            {transcription && state === 'analyzing' && (
              <div className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="text-sm font-semibold text-blue-900 mb-2">
                  {locale === 'mn' ? 'Таны хэлсэн үг:' : 'You said:'}
                </div>
                <div className="text-gray-700 italic">
                  "{transcription}"
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Convert Blob to base64 string (without data URL prefix)
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
      const base64Data = base64.split(',')[1]
      resolve(base64Data)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
