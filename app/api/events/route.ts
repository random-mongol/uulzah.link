import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { generateSecureToken } from '@/lib/utils/crypto'
import { generateShortId } from '@/lib/utils/id'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, dates, fingerprint } = body

    // Validation
    if (!title || title.length < 3 || title.length > 255) {
      return NextResponse.json(
        { error: 'Title must be between 3 and 255 characters' },
        { status: 400 }
      )
    }

    if (!dates || dates.length === 0) {
      return NextResponse.json(
        { error: 'At least one date is required' },
        { status: 400 }
      )
    }

    // Generate short ID and edit token
    const eventId = generateShortId()
    const editToken = generateSecureToken()

    // Create event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        id: eventId,
        title,
        description: description || null,
        edit_token: editToken,
        creator_fingerprint: fingerprint || null,
        timezone: 'Asia/Ulaanbaatar',
      })
      .select()
      .single()

    if (eventError) {
      console.error('Event creation error:', eventError)
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      )
    }

    // Create event dates
    const eventDates = dates.map((date: any, index: number) => ({
      event_id: event.id,
      start_datetime: date.startDatetime,
      end_datetime: date.endDatetime || null,
      is_all_day: date.isAllDay || false,
      display_order: index,
    }))

    const { error: datesError } = await supabase
      .from('event_dates')
      .insert(eventDates)

    if (datesError) {
      console.error('Event dates creation error:', datesError)
      // Rollback event creation
      await supabase.from('events').delete().eq('id', event.id)
      return NextResponse.json(
        { error: 'Failed to create event dates' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      eventId: event.id,
      editToken,
    }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
