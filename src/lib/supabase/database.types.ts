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
          id: string
          name: string
          category: 'equipment' | 'software' | 'furniture' | 'vehicle' | 'other'
          purchase_date: string
          purchase_price: number
          useful_life_years: number
          current_value: number
          depreciation_per_year: number
          assigned_to: string | null
          serial_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: 'equipment' | 'software' | 'furniture' | 'vehicle' | 'other'
          purchase_date: string
          purchase_price: number
          useful_life_years?: number
          current_value: number
          depreciation_per_year: number
          assigned_to?: string | null
          serial_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'equipment' | 'software' | 'furniture' | 'vehicle' | 'other'
          purchase_date?: string
          purchase_price?: number
          useful_life_years?: number
          current_value?: number
          depreciation_per_year?: number
          assigned_to?: string | null
          serial_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }
      company_settings: {
        Row: {
          id: string
          name: string
          address: string
          trn: string | null
          logo_url: string | null
          working_hours_per_day: number
          working_days_per_week: number
          default_vat_rate: number
          default_profit_margin: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          trn?: string | null
          logo_url?: string | null
          working_hours_per_day?: number
          working_days_per_week?: number
          default_vat_rate?: number
          default_profit_margin?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          trn?: string | null
          logo_url?: string | null
          working_hours_per_day?: number
          working_days_per_week?: number
          default_vat_rate?: number
          default_profit_margin?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_contacts: {
        Row: {
          id: string
          customer_id: string
          name: string
          email: string | null
          phone: string | null
          position: string | null
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          name: string
          email?: string | null
          phone?: string | null
          position?: string | null
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          position?: string | null
          is_primary?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_contacts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          id: string
          name: string
          location: string | null
          website: string | null
          industry: string | null
          notes: string | null
          trn: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location?: string | null
          website?: string | null
          industry?: string | null
          notes?: string | null
          trn?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string | null
          website?: string | null
          industry?: string | null
          notes?: string | null
          trn?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          password: string | null
          role: 'admin' | 'sr_manager' | 'manager' | 'designer' | 'hr' | 'pm'
          job_title: string | null
          department: string | null
          base_salary: number
          compensation: number
          insurance: number
          ticket_value: number
          visa_cost: number
          vacation_days: number
          start_date: string
          end_date: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          password?: string | null
          role?: 'admin' | 'sr_manager' | 'manager' | 'designer' | 'hr' | 'pm'
          job_title?: string | null
          department?: string | null
          base_salary?: number
          compensation?: number
          insurance?: number
          ticket_value?: number
          visa_cost?: number
          vacation_days?: number
          start_date?: string
          end_date?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          password?: string | null
          role?: 'admin' | 'sr_manager' | 'manager' | 'designer' | 'hr' | 'pm'
          job_title?: string | null
          department?: string | null
          base_salary?: number
          compensation?: number
          insurance?: number
          ticket_value?: number
          visa_cost?: number
          vacation_days?: number
          start_date?: string
          end_date?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          id: string
          description: string
          amount: number
          category: 'rent' | 'utilities' | 'software' | 'equipment' | 'marketing' | 'office_supplies' | 'professional_services' | 'travel' | 'team_activities' | 'taxes_fees' | 'insurance' | 'maintenance' | 'other'
          status: 'pending' | 'paid' | 'voided'
          expense_date: string
          payment_date: string | null
          due_date: string | null
          payment_method: string | null
          payment_reference: string | null
          vendor_name: string | null
          is_asset_purchase: boolean
          asset_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          amount: number
          category: 'rent' | 'utilities' | 'software' | 'equipment' | 'marketing' | 'office_supplies' | 'professional_services' | 'travel' | 'team_activities' | 'taxes_fees' | 'insurance' | 'maintenance' | 'other'
          status?: 'pending' | 'paid' | 'voided'
          expense_date: string
          payment_date?: string | null
          due_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          vendor_name?: string | null
          is_asset_purchase?: boolean
          asset_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          amount?: number
          category?: 'rent' | 'utilities' | 'software' | 'equipment' | 'marketing' | 'office_supplies' | 'professional_services' | 'travel' | 'team_activities' | 'taxes_fees' | 'insurance' | 'maintenance' | 'other'
          status?: 'pending' | 'paid' | 'voided'
          expense_date?: string
          payment_date?: string | null
          due_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          vendor_name?: string | null
          is_asset_purchase?: boolean
          asset_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          }
        ]
      }
      holidays: {
        Row: {
          id: string
          name: string
          date: string
          year: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          date: string
          year: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          date?: string
          year?: number
          created_at?: string
        }
        Relationships: []
      }
      overhead_costs: {
        Row: {
          id: string
          name: string
          amount: number
          frequency: 'monthly' | 'yearly'
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          amount: number
          frequency?: 'monthly' | 'yearly'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          amount?: number
          frequency?: 'monthly' | 'yearly'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          base_price: number
          estimated_hours: number
          category: 'powerpoint' | 'video' | 'branding'
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          base_price?: number
          estimated_hours?: number
          category?: 'powerpoint' | 'video' | 'branding'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          base_price?: number
          estimated_hours?: number
          category?: 'powerpoint' | 'video' | 'branding'
          active?: boolean
          created_at?: string
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
        Args: {
          p_employee_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      asset_category: 'equipment' | 'software' | 'furniture' | 'vehicle' | 'other'
      expense_category: 'rent' | 'utilities' | 'software' | 'equipment' | 'marketing' | 'office_supplies' | 'professional_services' | 'travel' | 'team_activities' | 'taxes_fees' | 'insurance' | 'maintenance' | 'other'
      expense_status: 'pending' | 'paid' | 'voided'
      overhead_frequency: 'monthly' | 'yearly'
      service_category: 'powerpoint' | 'video' | 'branding'
      user_role: 'admin' | 'sr_manager' | 'manager' | 'designer' | 'hr' | 'pm'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type Functions<
  PublicFuncNameOrOptions extends
    | keyof PublicSchema["Functions"]
    | { schema: keyof Database },
  FuncName extends PublicFuncNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicFuncNameOrOptions["schema"]]["Functions"]
    : never = never,
> = PublicFuncNameOrOptions extends { schema: keyof Database }
  ? Database[PublicFuncNameOrOptions["schema"]]["Functions"][FuncName]
  : PublicFuncNameOrOptions extends keyof PublicSchema["Functions"]
    ? PublicSchema["Functions"][PublicFuncNameOrOptions]
    : never
