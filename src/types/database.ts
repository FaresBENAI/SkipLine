export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          address: string | null
          logo_url: string | null
          avatar_type: string
          qr_code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          logo_url?: string | null
          avatar_type?: string
          qr_code: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          logo_url?: string | null
          avatar_type?: string
          qr_code?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          profile_picture_url: string | null
          avatar_type: string
          qr_code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          profile_picture_url?: string | null
          avatar_type?: string
          qr_code: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          profile_picture_url?: string | null
          avatar_type?: string
          qr_code?: string
          created_at?: string
          updated_at?: string
        }
      }
      queues: {
        Row: {
          id: string
          company_id: string
          name: string
          description: string | null
          average_wait_time: number
          is_active: boolean
          is_paused: boolean
          max_capacity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          description?: string | null
          average_wait_time?: number
          is_active?: boolean
          is_paused?: boolean
          max_capacity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          description?: string | null
          average_wait_time?: number
          is_active?: boolean
          is_paused?: boolean
          max_capacity?: number
          created_at?: string
          updated_at?: string
        }
      }
      queue_entries: {
        Row: {
          id: string
          queue_id: string
          user_id: string | null
          guest_name: string | null
          guest_email: string | null
          guest_phone: string | null
          position: number
          status: string
          estimated_wait_time: number | null
          joined_at: string
          called_at: string | null
          served_at: string | null
        }
        Insert: {
          id?: string
          queue_id: string
          user_id?: string | null
          guest_name?: string | null
          guest_email?: string | null
          guest_phone?: string | null
          position: number
          status?: string
          estimated_wait_time?: number | null
          joined_at?: string
          called_at?: string | null
          served_at?: string | null
        }
        Update: {
          id?: string
          queue_id?: string
          user_id?: string | null
          guest_name?: string | null
          guest_email?: string | null
          guest_phone?: string | null
          position?: number
          status?: string
          estimated_wait_time?: number | null
          joined_at?: string
          called_at?: string | null
          served_at?: string | null
        }
      }
    }
  }
}
