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
      profiles: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      studios: {
        Row: {
          id: string
          name: string
          description: string | null
          location_text: string
          region_code: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          location_text: string
          region_code?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          location_text?: string
          region_code?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          studio_id: string
          name: string
          category: string
          description: string
          price: number
          duration_minutes: number
          cover_image_path: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          studio_id: string
          name: string
          category: string
          description: string
          price: number
          duration_minutes: number
          cover_image_path?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          studio_id?: string
          name?: string
          category?: string
          description?: string
          price?: number
          duration_minutes?: number
          cover_image_path?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      class_sessions: {
        Row: {
          id: string
          class_id: string
          start_at: string
          capacity: number
          booked_count: number
          status: 'SCHEDULED' | 'CANCELLED'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          start_at: string
          capacity: number
          booked_count?: number
          status?: 'SCHEDULED' | 'CANCELLED'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          start_at?: string
          capacity?: number
          booked_count?: number
          status?: 'SCHEDULED' | 'CANCELLED'
          created_at?: string
          updated_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          user_id: string
          session_id: string
          head_count: number
          status: 'PENDING' | 'CONFIRMED' | 'APPROVED' | 'CANCELLED'
          class_name_snapshot: string
          studio_name_snapshot: string
          price_snapshot: number
          cancelled_at: string | null
          cancel_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          head_count: number
          status?: 'PENDING' | 'CONFIRMED' | 'APPROVED' | 'CANCELLED'
          class_name_snapshot: string
          studio_name_snapshot: string
          price_snapshot: number
          cancelled_at?: string | null
          cancel_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          head_count?: number
          status?: 'PENDING' | 'CONFIRMED' | 'APPROVED' | 'CANCELLED'
          class_name_snapshot?: string
          studio_name_snapshot?: string
          price_snapshot?: number
          cancelled_at?: string | null
          cancel_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
