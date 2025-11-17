import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const eventId = params.eventId

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title, description')
      .eq('id', eventId)
      .is('deleted_at', null)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Get event dates
    const { data: dates, error: datesError } = await supabase
      .from('event_dates')
      .select('*')
      .eq('event_id', eventId)
      .order('display_order')

    if (datesError) {
      return NextResponse.json(
        { error: 'Failed to load event dates' },
        { status: 500 }
      )
    }

    // Get all participants and their responses
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('id, name, comment')
      .eq('event_id', eventId)
      .order('created_at')

    if (participantsError) {
      return NextResponse.json(
        { error: 'Failed to load participants' },
        { status: 500 }
      )
    }

    // Get all responses
    const { data: allResponses, error: responsesError } = await supabase
      .from('responses')
      .select('participant_id, event_date_id, status')
      .in('participant_id', participants?.map(p => p.id) || [])

    if (responsesError) {
      return NextResponse.json(
        { error: 'Failed to load responses' },
        { status: 500 }
      )
    }

    // Calculate counts for each date
    const datesWithCounts = (dates || []).map(date => {
      const dateResponses = allResponses?.filter(r => r.event_date_id === date.id) || []
      return {
        id: date.id,
        start_datetime: date.start_datetime,
        yes_count: dateResponses.filter(r => r.status === 'yes').length,
        maybe_count: dateResponses.filter(r => r.status === 'maybe').length,
        no_count: dateResponses.filter(r => r.status === 'no').length,
      }
    })

    // Format participants with their responses
    const participantsWithResponses = (participants || []).map(participant => {
      const participantResponses = allResponses?.filter(
        r => r.participant_id === participant.id
      ) || []

      const responsesMap: Record<number, 'yes' | 'no' | 'maybe'> = {}
      participantResponses.forEach(r => {
        responsesMap[r.event_date_id] = r.status as 'yes' | 'no' | 'maybe'
      })

      return {
        id: participant.id,
        name: participant.name,
        responses: responsesMap,
      }
    })

    return NextResponse.json({
      event,
      dates: datesWithCounts,
      participants: participantsWithResponses,
      totalParticipants: participants?.length || 0,
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
