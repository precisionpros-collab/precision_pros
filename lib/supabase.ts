import { createClient } from '@supabase/supabase-js'

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || url === 'your_supabase_project_url') {
    return 'https://placeholder.supabase.co'
  }
  return url
}

function getAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key'
}

function getServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_service_key'
}

export const supabase = createClient(getSupabaseUrl(), getAnonKey())
export const supabaseAdmin = createClient(getSupabaseUrl(), getServiceKey(), {
  auth: { autoRefreshToken: false, persistSession: false }
})

export type Database = {
  public: {
    Tables: {
      services: {
        Row: {
          id: string; title: string; description: string; icon: string
          category: string; features: string[]; is_visible: boolean
          order_index: number; created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      works: {
        Row: {
          id: string; title: string; description: string; image_url: string | null
          tags: string[]; category: string; is_featured: boolean; is_visible: boolean
          order_index: number; client_name: string | null; project_url: string | null
          github_url: string | null
          created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['works']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['works']['Insert']>
      }
      team_members: {
        Row: {
          id: string; name: string; role: string; designation: string
          photo_url: string | null; linkedin_url: string | null; instagram_url: string | null
          is_visible: boolean; order_index: number; created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['team_members']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>
      }
      contact_requests: {
        Row: {
          id: string; name: string; email: string; phone: string | null
          company: string | null; service_type: string; message: string
          status: 'new' | 'read' | 'replied'; created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['contact_requests']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['contact_requests']['Insert']>
      }
      site_settings: {
        Row: { id: string; key: string; value: string; updated_at: string }
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>
      }
      auth_failures: {
        Row: {
          id: string;
          attempted_email: string | null;
          ip_address: string | null;
          user_agent: string | null;
          error_message: string;
          created_at: string;
        }
        Insert: Omit<Database['public']['Tables']['auth_failures']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['auth_failures']['Insert']>
      }
    }
  }
}
