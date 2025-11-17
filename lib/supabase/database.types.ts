export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          location: string | null
          owner_name: string | null
          owner_email: string | null
          edit_token: string
          creator_fingerprint: string | null
          timezone: string
          allow_multiple_dates: boolean
          allow_maybe: boolean
          show_responses_after_submit: boolean
          deadline_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
          view_count: number
          response_count: number
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          location?: string | null
          owner_name?: string | null
          owner_email?: string | null
          edit_token: string
          creator_fingerprint?: string | null
          timezone?: string
          allow_multiple_dates?: boolean
          allow_maybe?: boolean
          show_responses_after_submit?: boolean
          deadline_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          view_count?: number
          response_count?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          location?: string | null
          owner_name?: string | null
          owner_email?: string | null
          edit_token?: string
          creator_fingerprint?: string | null
          timezone?: string
          allow_multiple_dates?: boolean
          allow_maybe?: boolean
          show_responses_after_submit?: boolean
          deadline_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          view_count?: number
          response_count?: number
        }
      }
      event_dates: {
        Row: {
          id: number
          event_id: string
          start_datetime: string
          end_datetime: string | null
          is_all_day: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: number
          event_id: string
          start_datetime: string
          end_datetime?: string | null
          is_all_day?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: number
          event_id?: string
          start_datetime?: string
          end_datetime?: string | null
          is_all_day?: boolean
          display_order?: number
          created_at?: string
        }
      }
      participants: {
        Row: {
          id: number
          event_id: string
          name: string
          email: string | null
          comment: string | null
          response_token: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          event_id: string
          name: string
          email?: string | null
          comment?: string | null
          response_token: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          event_id?: string
          name?: string
          email?: string | null
          comment?: string | null
          response_token?: string
          created_at?: string
          updated_at?: string
        }
      }
      responses: {
        Row: {
          id: number
          participant_id: number
          event_date_id: number
          status: 'yes' | 'no' | 'maybe'
          created_at: string
        }
        Insert: {
          id?: number
          participant_id: number
          event_date_id: number
          status: 'yes' | 'no' | 'maybe'
          created_at?: string
        }
        Update: {
          id?: number
          participant_id?: number
          event_date_id?: number
          status?: 'yes' | 'no' | 'maybe'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
