export type UserType = 'company' | 'client'

export interface Company {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  logo_url?: string
  avatar_type: 'upload' | 'avatar' | 'default'
  qr_code: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  profile_picture_url?: string
  avatar_type: 'upload' | 'avatar' | 'default'
  qr_code: string
  created_at: string
  updated_at: string
}

export interface Queue {
  id: string
  company_id: string
  name: string
  description?: string
  average_wait_time: number
  is_active: boolean
  is_paused: boolean
  max_capacity: number
  created_at: string
  updated_at: string
}

export interface QueueEntry {
  id: string
  queue_id: string
  user_id?: string
  guest_name?: string
  guest_email?: string
  guest_phone?: string
  position: number
  status: 'waiting' | 'called' | 'served' | 'cancelled'
  estimated_wait_time?: number
  joined_at: string
  called_at?: string
  served_at?: string
}

export interface AuthFormData {
  email: string
  password: string
  confirmPassword?: string
  userType?: UserType
  // Pour les entreprises
  companyName?: string
  phone?: string
  address?: string
  // Pour les clients
  firstName?: string
  lastName?: string
}
