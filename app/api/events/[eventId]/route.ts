import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
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

    // Increment view count
    await supabase
      .from('events')
      .update({ view_count: event.view_count + 1 })
      .eq('id', eventId)

    return NextResponse.json({
      id: event.id,
      title: event.title,
      description: event.description,
      timezone: event.timezone,
      dates: dates || [],
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const editToken = request.headers.get('x-edit-token')
    const body = await request.json()
    const { title, description } = body

    // Validation
    if (!editToken) {
      return NextResponse.json(
        { error: 'Edit token is required' },
        { status: 401 }
      )
    }

    if (!title || title.length < 3 || title.length > 255) {
      return NextResponse.json(
        { error: 'Title must be between 3 and 255 characters' },
        { status: 400 }
      )
    }

    // Verify edit token
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, edit_token')
      .eq('id', eventId)
      .eq('edit_token', editToken)
      .is('deleted_at', null)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Invalid edit token' },
        { status: 403 }
      )
    }

    // Update event
    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update({
        title,
        description: description || null,
      })
      .eq('id', eventId)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      event: updatedEvent,
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
