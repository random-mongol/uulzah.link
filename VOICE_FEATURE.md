# Voice Recording Feature

This document describes the voice recording feature that allows users to create meetings by speaking instead of typing.

## Overview

Users can now fill in meeting details (title, description, and possible dates) by speaking in Mongolian. The feature uses:
- **Browser MediaRecorder API** for audio capture
- **Gemini AI API** for speech-to-text and structured data extraction
- **Multiple API key rotation** for high availability

## Features

- 🎤 **Voice input**: Record up to 30 seconds of audio
- 📱 **Full-screen recording**: Immersive recording experience with waveform visualization
- 🌊 **Real-time waveform**: iPhone Voice Memos-style audio visualization
- 📝 **Two-step processing**: Transcribe first, then analyze for better accuracy
- 💬 **Transcription preview**: See what was transcribed before analysis
- 🔄 **Auto-fill**: Automatically fills form fields with extracted data
- 🌐 **Multi-platform**: Works on both mobile and web browsers
- 🇲🇳 **Mongolian support**: Optimized for Mongolian language
- 🔑 **API key rotation**: Automatic failover between multiple API keys
- ✅ **Structured output**: Guaranteed JSON schema response

## Setup Instructions

### 1. Get Gemini API Keys

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Create multiple API keys (recommended: 3-5 keys for rotation)
5. Copy each API key

**Important**: These are free API keys with usage limits. Multiple keys allow the app to rotate between them when limits are reached.

### 2. Configure Environment Variables

Add your Gemini API keys to `.env.local`:

```bash
# Multiple API keys separated by commas
GEMINI_API_KEYS=AIzaSyXXXXXXXXXXXX,AIzaSyYYYYYYYYYYYY,AIzaSyZZZZZZZZZZZZ

# Optional: Override default settings
# GEMINI_MODEL=gemini-2.0-flash-exp
# GEMINI_BASE_URL=https://generativelanguage.googleapis.com
```

### 3. Restart Development Server

```bash
pnpm dev
```

## Usage

### For Users

1. Navigate to the "Create Meeting" page
2. Click the **"Дуугаар оруулах"** (Voice Input) button
3. Allow microphone permission when prompted
4. **Full-screen recording mode** will activate:
   - You'll see a blue gradient background
   - Real-time waveform visualization shows your voice level
   - Timer counts up from 0:00 to 0:30
   - Red recording indicator pulses at the top
5. Speak clearly in Mongolian, for example:
   - "Хамтрагчдын уулзалт маргааш орой 7 цагт, бас дараа долоо хоногийн Мягмар 6 цагт"
   - "Долоо хоногийн уулзалт. Энэ долоо хоногийн Лхагва эсвэл Баасан 18:00-20:00 хооронд хийх боломжтой"
6. Click **"Дуусгах"** (Finish) button when done (or wait for 30-second limit)
7. **Processing stages**:
   - **Transcribing** (5-10 seconds): Converting your voice to text
   - **Analyzing** (3-5 seconds): Extracting meeting details
   - You'll see your transcribed text briefly during analysis
8. The form will automatically fill with:
   - **Гарчиг** (Title)
   - **Тайлбар** (Description, if mentioned)
   - **Боломжит огноонууд** (Possible dates)
9. Review and edit the auto-filled data if needed
10. Submit the form as usual

### Voice Input Tips

- Speak clearly and at a moderate pace
- Mention the meeting title first
- Use natural Mongolian date expressions:
  - "өнөөдөр" (today)
  - "маргааш" (tomorrow)
  - "дараа долоо хоногийн Мягмар" (next Tuesday)
  - "ирэх сарын 15" (15th of next month)
- Specify times if needed:
  - "орой" (evening, 18:00-20:00)
  - "үдээс хойш" (afternoon, 13:00-17:00)
  - "7 цагт" (at 7:00)
  - "18:00-20:00 хооронд" (between 18:00-20:00)
- Maximum recording duration: 30 seconds

## Architecture

### Frontend Components

#### `VoiceRecorder.tsx`
- Manages recording state machine (idle → recording → transcribing → analyzing)
- Handles audio recording using MediaRecorder API
- Creates audio context and analyser for waveform
- Shows full-screen recording modal
- Displays transcribing and analyzing overlays
- Shows transcription preview during analysis
- Converts audio to base64 for API transmission

#### `VoiceRecordingModal.tsx`
- Full-screen recording interface with blue gradient
- Real-time waveform visualization
- Timer display and controls
- Finish/Cancel buttons
- Responsive design for mobile and desktop

#### `AudioWaveform.tsx`
- Canvas-based waveform visualization
- Reads frequency data from AnalyserNode
- 32 animated bars similar to iPhone Voice Memos
- Blue gradient styling
- Optimized for 60fps animation

#### `app/[locale]/create/page.tsx`
- Integrates VoiceRecorder component
- Handles voice result callback
- Auto-fills form fields with extracted data
- Allows user to review and edit

### Backend API

#### `/api/voice-to-meeting/route.ts`
- **Two-step processing**:
  1. **Step 1: Transcription** - Converts audio to text using Gemini
  2. **Step 2: Analysis** - Extracts structured data from transcribed text
- Receives base64-encoded audio
- Validates audio size (max 5MB)
- Returns structured JSON with transcription included
- Better accuracy through separate transcription and analysis

### Utilities

#### `lib/utils/gemini.ts`
- **API key rotation**: Round-robin selection
- **Retry logic**: Automatic failover on quota errors
- **Error handling**: Distinguishes retryable vs. fatal errors
- **Transcription**: `transcribeAudio()` - Audio to text conversion
- **Analysis**: `analyzeTranscription()` - Text to structured data extraction
- **Structured output**: Enforces JSON schema compliance

## API Response Schema

```typescript
{
  success: true,
  transcription: string,      // e.g., "Хамтрагчдын уулзалт маргааш орой 7 цагт"
  data: {
    title: string,              // e.g., "Хамтрагчдын уулзалт"
    description: string | null, // e.g., "Ажлын явц хэлэлцэх"
    possibleDates: [
      {
        rawText: string,        // e.g., "маргааш орой"
        isoDate: string | null, // e.g., "2025-11-18"
        timeRange: string | null // e.g., "18:00-20:00" or "19:00"
      }
    ]
  }
}
```

## Browser Compatibility

### Supported Browsers

✅ **Desktop**
- Chrome 49+
- Edge 79+
- Firefox 25+
- Safari 14.1+
- Opera 36+

✅ **Mobile**
- Chrome for Android 49+
- Safari iOS 14.5+
- Samsung Internet 5+
- Firefox for Android 25+

### Audio Formats

The component automatically selects the best supported format:
1. `audio/webm;codecs=opus` (preferred)
2. `audio/webm`
3. `audio/mp4`
4. `audio/ogg`
5. `audio/wav`

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Микрофон ашиглах зөвшөөрөл шаардлагатай" | Microphone permission denied | Grant microphone permission in browser settings |
| "Таны хөтөч дуу бичих боломжгүй байна" | Browser doesn't support MediaRecorder | Use a modern browser (Chrome, Edge, Firefox) |
| "Audio file too large (max 5MB)" | Recording too long or high quality | Keep recordings under 30 seconds |
| "All Gemini API keys failed" | All API keys exhausted | Add more API keys or wait for quota reset |

### API Key Rotation

When an API key reaches its quota:
1. The system automatically tries the next key
2. Logs indicate which key failed
3. Continues until a key succeeds or all keys are exhausted
4. Returns error only if all keys fail

## Cost & Limits

### Gemini API Free Tier (as of 2025)

- **Rate limit**: 15 requests per minute per key
- **Daily limit**: Varies by region
- **Audio limit**: ~10 minutes of audio per day per key

**With 3 API keys**, you can handle ~3x the traffic before hitting limits.

### Optimization Tips

1. Use multiple API keys (recommended: 3-5)
2. Monitor usage in Google AI Studio
3. Add rate limiting on frontend if needed
4. Consider upgrading to paid tier for production

## Testing

### Manual Testing Checklist

- [ ] Test on Chrome (desktop)
- [ ] Test on Firefox (desktop)
- [ ] Test on Safari (desktop)
- [ ] Test on Chrome (mobile)
- [ ] Test on Safari iOS
- [ ] Test microphone permission flow
- [ ] Test with different Mongolian phrases
- [ ] Test with date expressions
- [ ] Test with time ranges
- [ ] Test auto-fill of all fields
- [ ] Test error handling (deny permission)
- [ ] Test 30-second timeout
- [ ] Test API key rotation (exhaust one key)

### Example Test Phrases

```
Тест 1: "Хамтрагчдын уулзалт маргааш орой 7 цагт"
Expected: Title, date=tomorrow, time=19:00

Тест 2: "Долоо хоногийн уулзалт. Ирэх Мягмар болон Лхагва 18:00-20:00 хооронд"
Expected: Title, 2 dates with time ranges

Тест 3: "Санал бодол хуваалцах цаглашгүй уулзалт"
Expected: Title, description, no specific dates
```

## Security Considerations

- ✅ API keys stored server-side only (not exposed to client)
- ✅ Audio processing happens server-side
- ✅ No audio data is stored
- ✅ HTTPS required for microphone access
- ✅ Input validation on API route
- ✅ Size limits prevent abuse

## Troubleshooting

### "No Gemini API keys configured"

**Solution**: Add `GEMINI_API_KEYS` to `.env.local` and restart server.

### Recording doesn't start

1. Check browser compatibility
2. Ensure HTTPS (localhost is OK for dev)
3. Grant microphone permission
4. Check browser console for errors

### Form doesn't auto-fill

1. Check that API keys are valid
2. Check API response in Network tab
3. Verify Gemini response format
4. Check browser console for parsing errors

### API returns empty results

1. Ensure you're speaking in Mongolian
2. Speak clearly with minimal background noise
3. Check that dates are recognizable expressions
4. Try shorter, simpler phrases first

## Future Improvements

- [ ] Support for English language input
- [ ] Better date parsing for complex expressions
- [ ] Audio visualization during recording
- [ ] Save and replay recording
- [ ] Speaker identification for multi-person meetings
- [ ] Real-time transcription preview
- [ ] Offline support with local models

## Support

For issues or questions:
1. Check this documentation
2. Review browser console errors
3. Verify API key configuration
4. Test with example phrases above
5. Create an issue in the repository

---

**Last Updated**: 2025-11-17
**Feature Version**: 1.0.0
**Supported Languages**: Mongolian (mn)
