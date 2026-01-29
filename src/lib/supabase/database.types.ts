export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          assigned_to: string | null
          category: Database["public"]["Enums"]["asset_category"]
          created_at: string
          current_value: number
          depreciation_per_year: number
          id: string
          name: string
          notes: string | null
          purchase_date: string
          purchase_price: number
          serial_number: string | null
          updated_at: string
          useful_life_years: number
        }
        Insert: {
          assigned_to?: string | null
          category: Database["public"]["Enums"]["asset_category"]
          created_at?: string
          current_value: number
          depreciation_per_year: number
          id?: string
          name: string
          notes?: string | null
          purchase_date: string
          purchase_price: number
          serial_number?: string | null
          updated_at?: string
          useful_life_years?: number
        }
        Update: {
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["asset_category"]
          created_at?: string
          current_value?: number
          depreciation_per_year?: number
          id?: string
          name?: string
          notes?: string | null
          purchase_date?: string
          purchase_price?: number
          serial_number?: string | null
          updated_at?: string
          useful_life_years?: number
        }
        Relationships: [
          {
            foreignKeyName: "assets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          address: string | null
          created_at: string
          currency: string
          default_profit_margin: number
          default_vat_rate: number
          id: string
          logo_url: string | null
          name: string
          trn: string | null
          updated_at: string
          working_days_per_week: number
          working_hours_per_day: number
        }
        Insert: {
          address?: string | null
          created_at?: string
          currency?: string
          default_profit_margin?: number
          default_vat_rate?: number
          id?: string
          logo_url?: string | null
          name: string
          trn?: string | null
          updated_at?: string
          working_days_per_week?: number
          working_hours_per_day?: number
        }
        Update: {
          address?: string | null
          created_at?: string
          currency?: string
          default_profit_margin?: number
          default_vat_rate?: number
          id?: string
          logo_url?: string | null
          name?: string
          trn?: string | null
          updated_at?: string
          working_days_per_week?: number
          working_hours_per_day?: number
        }
        Relationships: []
      }
      customer_contacts: {
        Row: {
          created_at: string
          customer_id: string
          email: string | null
          id: string
          is_primary: boolean
          name: string
          phone: string | null
          position: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          email?: string | null
          id?: string
          is_primary?: boolean
          name: string
          phone?: string | null
          position?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          email?: string | null
          id?: string
          is_primary?: boolean
          name?: string
          phone?: string | null
          position?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_contacts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          id: string
          industry: string | null
          location: string | null
          name: string
          notes: string | null
          trn: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          industry?: string | null
          location?: string | null
          name: string
          notes?: string | null
          trn?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          industry?: string | null
          location?: string | null
          name?: string
          notes?: string | null
          trn?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          active: boolean
          base_salary: number
          created_at: string
          department: string | null
          documents: Json | null
          email: string
          emergency_contact: Json | null
          end_date: string | null
          full_name: string
          id: string
          insurance: number
          job_title: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          start_date: string
          ticket_value: number
          updated_at: string
          vacation_days: number
          visa_cost: number
        }
        Insert: {
          active?: boolean
          base_salary?: number
          created_at?: string
          department?: string | null
          documents?: Json | null
          email: string
          emergency_contact?: Json | null
          end_date?: string | null
          full_name: string
          id?: string
          insurance?: number
          job_title?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          start_date?: string
          ticket_value?: number
          updated_at?: string
          vacation_days?: number
          visa_cost?: number
        }
        Update: {
          active?: boolean
          base_salary?: number
          created_at?: string
          department?: string | null
          documents?: Json | null
          email?: string
          emergency_contact?: Json | null
          end_date?: string | null
          full_name?: string
          id?: string
          insurance?: number
          job_title?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          start_date?: string
          ticket_value?: number
          updated_at?: string
          vacation_days?: number
          visa_cost?: number
        }
        Relationships: []
      }
      holidays: {
        Row: {
          created_at: string
          date: string
          id: string
          name: string
          year: number
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          name: string
          year: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          name?: string
          year?: number
        }
        Relationships: []
      }
      overhead_costs: {
        Row: {
          active: boolean
          amount: number
          created_at: string
          frequency: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          amount: number
          created_at?: string
          frequency: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          amount?: number
          created_at?: string
          frequency?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          base_price: number
          category: Database["public"]["Enums"]["service_category"]
          created_at: string
          description: string | null
          estimated_hours: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          base_price?: number
          category: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description?: string | null
          estimated_hours?: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          base_price?: number
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description?: string | null
          estimated_hours?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_employee_hourly_cost: {
        Args: { p_employee_id: string }
        Returns: {
          asset_depreciation_monthly: number
          daily_cost: number
          full_monthly_cost: number
          hourly_cost: number
          monthly_cost: number
          overhead_share: number
          working_days_per_year: number
          yearly_cost: number
        }[]
      }
      get_active_employee_count: { Args: Record<string, never>; Returns: number }
      get_employee_asset_depreciation: {
        Args: { p_employee_id: string }
        Returns: number
      }
      get_holiday_count: { Args: { p_year?: number }; Returns: number }
      get_total_asset_value: { Args: Record<string, never>; Returns: number }
      get_total_monthly_overhead: { Args: Record<string, never>; Returns: number }
    }
    Enums: {
      asset_category: "equipment" | "software" | "furniture" | "vehicle" | "other"
      service_category: "powerpoint" | "video" | "branding"
      user_role: "admin" | "sr_manager" | "manager" | "designer" | "hr" | "pm"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]
