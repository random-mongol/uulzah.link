import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const body = await request.json()
    const { editToken, fingerprint } = body

    // Validation
    if (!editToken || !fingerprint) {
      return NextResponse.json(
        { error: 'Edit token and fingerprint are required', canEdit: false },
        { status: 400 }
      )
    }

    // Get event with edit token and fingerprint
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, edit_token, creator_fingerprint')
      .eq('id', eventId)
      .eq('edit_token', editToken)
      .is('deleted_at', null)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Invalid edit token', canEdit: false },
        { status: 403 }
      )
    }

    // Check if fingerprint matches
    const canEdit = event.creator_fingerprint === fingerprint

    return NextResponse.json({
      canEdit,
      message: canEdit
        ? 'Access granted'
        : 'Device mismatch. This event can only be edited from the device that created it.',
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', canEdit: false },
      { status: 500 }
    )
  }
}
