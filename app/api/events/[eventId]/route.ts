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
    const { title, description, dates, locale = 'mn' } = body
    const getErrorMsg = (mn: string, en: string) => locale === 'mn' ? mn : en

    // Validation
    if (!editToken) {
      return NextResponse.json(
        { error: 'Edit token is required' },
        { status: 401 }
      )
    }

    const trimmedTitle = title?.trim() || ''

    if (!trimmedTitle || trimmedTitle.length < 3 || trimmedTitle.length > 255) {
      return NextResponse.json(
        { error: getErrorMsg('Гарчиг 3-аас 255 тэмдэгттэй байх ёстой', 'Title must be between 3 and 255 characters') },
        { status: 400 }
      )
    }

    // Validate dates only if provided (optional for backward compatibility)
    if (dates !== undefined) {
      if (!Array.isArray(dates) || dates.length === 0) {
        return NextResponse.json(
          { error: getErrorMsg('Ядаж нэг огноо шаардлагатай', 'At least one date is required') },
          { status: 400 }
        )
      }

      const seen = new Set<string>()
      for (const date of dates) {
        if (!date.startDatetime) {
          return NextResponse.json(
            { error: getErrorMsg('Огнооны мэдээлэл дутуу байна', 'Date payload is incomplete') },
            { status: 400 }
          )
        }

        const start = new Date(date.startDatetime)
        if (Number.isNaN(start.getTime())) {
          return NextResponse.json(
            { error: getErrorMsg('Огноо буруу байна', 'Invalid start date/time') },
            { status: 400 }
          )
        }

        if (date.endDatetime) {
          const end = new Date(date.endDatetime)
          if (Number.isNaN(end.getTime()) || end <= start) {
            return NextResponse.json(
              { error: getErrorMsg('Дуусах цаг эхлэхээс өмнө байж болохгүй', 'End time must be after start time') },
              { status: 400 }
            )
          }
        }

        const key = `${start.toISOString()}-${date.endDatetime ? new Date(date.endDatetime).toISOString() : ''}`
        if (seen.has(key)) {
          return NextResponse.json(
            { error: getErrorMsg('Давхардсан огноо байна', 'Duplicate dates detected') },
            { status: 400 }
          )
        }
        seen.add(key)
      }
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

    // Update event metadata
    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update({
        title: trimmedTitle,
        description: description?.trim() || null,
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

    let updatedDates = null

    // If dates were provided, sync event_dates (add, update, delete)
    if (dates !== undefined) {
      const normalizedDates = dates.map((date: any, index: number) => ({
        id: date.id,
        event_id: eventId,
        start_datetime: new Date(date.startDatetime).toISOString(),
        end_datetime: date.endDatetime ? new Date(date.endDatetime).toISOString() : null,
        is_all_day: !!date.isAllDay,
        display_order: index,
      }))

      const incomingIds = normalizedDates.filter(d => d.id).map(d => d.id)

      // Remove dates that are no longer present
      const { data: existingDates, error: existingDatesError } = await supabase
        .from('event_dates')
        .select('id')
        .eq('event_id', eventId)

      if (existingDatesError) {
        console.error('Fetch event_dates error:', existingDatesError)
        return NextResponse.json(
          { error: 'Failed to load event dates' },
          { status: 500 }
        )
      }

      const toDelete = (existingDates || [])
        .filter(date => !incomingIds.includes(date.id))
        .map(date => date.id)

      if (toDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('event_dates')
          .delete()
          .eq('event_id', eventId)
          .in('id', toDelete)

        if (deleteError) {
          console.error('Delete event_dates error:', deleteError)
          return NextResponse.json(
            { error: 'Failed to remove old dates' },
            { status: 500 }
          )
        }
      }

      // Upsert new/updated dates
      const { data: upsertedDates, error: upsertError } = await supabase
        .from('event_dates')
        .upsert(normalizedDates, { onConflict: 'id' })
        .select()
        .order('display_order')

      if (upsertError) {
        console.error('Upsert event_dates error:', upsertError)
        return NextResponse.json(
          { error: 'Failed to update event dates' },
          { status: 500 }
        )
      }

      updatedDates = upsertedDates
    }

    return NextResponse.json({
      success: true,
      event: updatedEvent,
      dates: updatedDates,
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const editToken = request.headers.get('x-edit-token')

    if (!editToken) {
      return NextResponse.json(
        { error: 'Edit token is required' },
        { status: 401 }
      )
    }

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, edit_token, deleted_at')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (event.deleted_at) {
      return NextResponse.json(
        { error: 'Event already deleted' },
        { status: 400 }
      )
    }

    if (event.edit_token !== editToken) {
      return NextResponse.json(
        { error: 'Invalid edit token' },
        { status: 403 }
      )
    }

    const { error: deleteError } = await supabase
      .from('events')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', eventId)

    if (deleteError) {
      console.error('Delete event error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
