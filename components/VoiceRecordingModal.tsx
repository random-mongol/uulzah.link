'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { AudioWaveform } from '@/components/ui/AudioWaveform'
import { Button } from '@/components/ui/Button'
import { t, Locale } from '@/lib/i18n/translations'

interface VoiceRecordingModalProps {
  isOpen: boolean
  locale: Locale
  timeLeft: number
  maxDuration: number
  analyser: AnalyserNode | null
  onFinish: () => void
  onCancel: () => void
}

/**
 * Full-screen recording modal with waveform visualization
 * Similar to iPhone Voice Memos interface
 */
export function VoiceRecordingModal({
  isOpen,
  locale,
  timeLeft,
  maxDuration,
  analyser,
  onFinish,
  onCancel,
}: VoiceRecordingModalProps) {
  const [recordedTime, setRecordedTime] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setRecordedTime(maxDuration - timeLeft)
    }
  }, [timeLeft, maxDuration, isOpen])

  if (!isOpen) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Close button */}
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
        aria-label="Cancel recording"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main content */}
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        {/* Status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white font-medium">
              {t('event.form.voiceRecording', locale)}
            </span>
          </div>
        </div>

        {/* Waveform visualization */}
        <div className="w-full bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
          <AudioWaveform analyser={analyser} isRecording={isOpen} />
        </div>

        {/* Timer */}
        <div className="text-center">
          <div className="text-6xl font-bold text-white font-mono tabular-nums mb-2">
            {formatTime(recordedTime)}
          </div>
          <div className="text-white/70 text-sm">
            {t('event.form.voiceMaxDuration', locale)}
          </div>
        </div>

        {/* Finish button */}
        <Button
          onClick={onFinish}
          variant="secondary"
          size="lg"
          className="w-full bg-white text-blue-600 hover:bg-white/90 text-lg font-semibold shadow-xl"
        >
          {locale === 'mn' ? 'Дуусгах' : 'Finish Recording'}
        </Button>

        {/* Instructions */}
        <div className="text-center text-white/60 text-sm max-w-xs">
          {locale === 'mn'
            ? 'Уулзалтын гарчиг, тайлбар болон боломжит огноонуудыг тодорхой хэлнэ үү'
            : 'Clearly speak the meeting title, description, and possible dates'}
        </div>
      </div>
    </div>
  )
}
