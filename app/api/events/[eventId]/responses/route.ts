import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { generateSecureToken } from '@/lib/utils/crypto'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const body = await request.json()
    const { participantName, comment, responses } = body

    // Validation
    if (!participantName || participantName.length < 1 || participantName.length > 100) {
      return NextResponse.json(
        { error: 'Name is required and must be less than 100 characters' },
        { status: 400 }
      )
    }

    // Check if event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, response_count')
      .eq('id', eventId)
      .is('deleted_at', null)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if participant name already exists
    const { data: existingParticipant } = await supabase
      .from('participants')
      .select('id')
      .eq('event_id', eventId)
      .eq('name', participantName)
      .single()

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'This name has already been used. Please use a different name.' },
        { status: 409 }
      )
    }

    // Generate response token
    const responseToken = generateSecureToken()

    // Create participant
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .insert({
        event_id: eventId,
        name: participantName,
        comment: comment || null,
        response_token: responseToken,
      })
      .select()
      .single()

    if (participantError) {
      console.error('Participant creation error:', participantError)
      return NextResponse.json(
        { error: 'Failed to create participant' },
        { status: 500 }
      )
    }

    // Create responses
    if (responses && responses.length > 0) {
      const responseRecords = responses.map((r: any) => ({
        participant_id: participant.id,
        event_date_id: r.eventDateId,
        status: r.status,
      }))

      const { error: responsesError } = await supabase
        .from('responses')
        .insert(responseRecords)

      if (responsesError) {
        console.error('Responses creation error:', responsesError)
        // Rollback participant creation
        await supabase.from('participants').delete().eq('id', participant.id)
        return NextResponse.json(
          { error: 'Failed to save responses' },
          { status: 500 }
        )
      }
    }

    // Update event response count
    await supabase
      .from('events')
      .update({ response_count: event.response_count + 1 })
      .eq('id', eventId)

    return NextResponse.json({
      participantId: participant.id,
      responseToken,
      message: 'Response submitted successfully',
    }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
