export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
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
          compensation: number | null
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
          compensation?: number | null
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
          compensation?: number | null
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
      expenses: {
        Row: {
          amount: number
          asset_id: string | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string | null
          description: string
          due_date: string | null
          expense_date: string
          id: string
          is_asset_purchase: boolean
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_reference: string | null
          status: Database["public"]["Enums"]["expense_status"]
          updated_at: string | null
          vendor_name: string | null
        }
        Insert: {
          amount: number
          asset_id?: string | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          description: string
          due_date?: string | null
          expense_date: string
          id?: string
          is_asset_purchase?: boolean
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: Database["public"]["Enums"]["expense_status"]
          updated_at?: string | null
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          asset_id?: string | null
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          description?: string
          due_date?: string | null
          expense_date?: string
          id?: string
          is_asset_purchase?: boolean
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: Database["public"]["Enums"]["expense_status"]
          updated_at?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
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
      offer_line_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_pass_through: boolean | null
          offer_id: string
          quantity: number
          service_id: string | null
          sort_order: number | null
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_pass_through?: boolean | null
          offer_id: string
          quantity?: number
          service_id?: string | null
          sort_order?: number | null
          total?: number
          unit_price?: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_pass_through?: boolean | null
          offer_id?: string
          quantity?: number
          service_id?: string | null
          sort_order?: number | null
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "offer_line_items_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_line_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          created_at: string | null
          customer_id: string
          date: string
          discount_amount: number | null
          discount_percent: number | null
          id: string
          labor_cost: number | null
          lpo_number: string | null
          notes: string | null
          offer_number: string
          overhead_amount: number | null
          overhead_percent: number | null
          profit_amount: number | null
          status: Database["public"]["Enums"]["offer_status"]
          subtotal: number
          tasks_initiated: boolean | null
          terms: string | null
          title: string | null
          total: number
          updated_at: string | null
          valid_until: string
          vat_amount: number
          vat_rate: number
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          date?: string
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          labor_cost?: number | null
          lpo_number?: string | null
          notes?: string | null
          offer_number: string
          overhead_amount?: number | null
          overhead_percent?: number | null
          profit_amount?: number | null
          status?: Database["public"]["Enums"]["offer_status"]
          subtotal?: number
          tasks_initiated?: boolean | null
          terms?: string | null
          title?: string | null
          total?: number
          updated_at?: string | null
          valid_until: string
          vat_amount?: number
          vat_rate?: number
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          date?: string
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          labor_cost?: number | null
          lpo_number?: string | null
          notes?: string | null
          offer_number?: string
          overhead_amount?: number | null
          overhead_percent?: number | null
          profit_amount?: number | null
          status?: Database["public"]["Enums"]["offer_status"]
          subtotal?: number
          tasks_initiated?: boolean | null
          terms?: string | null
          title?: string | null
          total?: number
          updated_at?: string | null
          valid_until?: string
          vat_amount?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "offers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
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
      service_categories: {
        Row: {
          id: string
          name: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      task_board_columns: {
        Row: {
          id: string
          name: string
          color: string
          sort_order: number
          is_system: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          sort_order?: number
          is_system?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          sort_order?: number
          is_system?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          offer_id: string | null
          offer_line_item_id: string | null
          service_id: string | null
          column_id: string
          title: string
          description: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          due_date: string | null
          target_completion_date: string | null
          hours_estimated: number
          hours_actual: number
          revision_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          offer_id?: string | null
          offer_line_item_id?: string | null
          service_id?: string | null
          column_id: string
          title: string
          description?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          due_date?: string | null
          target_completion_date?: string | null
          hours_estimated?: number
          hours_actual?: number
          revision_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          offer_id?: string | null
          offer_line_item_id?: string | null
          service_id?: string | null
          column_id?: string
          title?: string
          description?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          due_date?: string | null
          target_completion_date?: string | null
          hours_estimated?: number
          hours_actual?: number
          revision_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "task_board_columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      task_subtasks: {
        Row: {
          id: string
          task_id: string
          title: string
          completed: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          completed?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          completed?: boolean
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_subtask_assignees: {
        Row: {
          id: string
          task_subtask_id: string
          employee_id: string
          created_at: string
        }
        Insert: {
          id?: string
          task_subtask_id: string
          employee_id: string
          created_at?: string
        }
        Update: {
          id?: string
          task_subtask_id?: string
          employee_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_subtask_assignees_task_subtask_id_fkey"
            columns: ["task_subtask_id"]
            isOneToOne: false
            referencedRelation: "task_subtasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_subtask_assignees_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          id: string
          task_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          author_id?: string
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      service_subtasks: {
        Row: {
          created_at: string | null
          id: string
          percentage: number
          service_id: string
          sort_order: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          percentage: number
          service_id: string
          sort_order?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          percentage?: number
          service_id?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_subtasks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean
          base_price: number
          category: Database["public"]["Enums"]["service_category"]
          category_id: string
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
          category?: Database["public"]["Enums"]["service_category"]
          category_id: string
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
          category_id?: string
          created_at?: string
          description?: string | null
          estimated_hours?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
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
          benefits_cost: number
          daily_cost: number
          full_monthly_cost: number
          hourly_cost: number
          monthly_cost: number
          overhead_share: number
          working_days_per_week: number
          working_days_per_year: number
          working_hours_per_day: number
          yearly_cost: number
        }[]
      }
      generate_offer_number: { Args: never; Returns: string }
      get_active_employee_count: { Args: never; Returns: number }
      get_employee_asset_depreciation: {
        Args: { p_employee_id: string }
        Returns: number
      }
      get_holiday_count: { Args: { p_year?: number }; Returns: number }
      get_total_asset_value: { Args: never; Returns: number }
      get_total_monthly_overhead: { Args: never; Returns: number }
    }
    Enums: {
      asset_category:
        | "equipment"
        | "software"
        | "furniture"
        | "vehicle"
        | "other"
      expense_category:
        | "rent"
        | "utilities"
        | "software"
        | "equipment"
        | "marketing"
        | "office_supplies"
        | "professional_services"
        | "travel"
        | "team_activities"
        | "taxes_fees"
        | "insurance"
        | "maintenance"
        | "other"
      expense_status: "pending" | "paid" | "voided"
      offer_status: "draft" | "sent" | "accepted" | "rejected" | "expired"
      service_category: "powerpoint" | "video" | "branding"
      task_priority: "low" | "medium" | "high" | "urgent"
      user_role: "admin" | "sr_manager" | "manager" | "designer" | "hr" | "pm"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      asset_category: [
        "equipment",
        "software",
        "furniture",
        "vehicle",
        "other",
      ],
      expense_category: [
        "rent",
        "utilities",
        "software",
        "equipment",
        "marketing",
        "office_supplies",
        "professional_services",
        "travel",
        "team_activities",
        "taxes_fees",
        "insurance",
        "maintenance",
        "other",
      ],
      expense_status: ["pending", "paid", "voided"],
      offer_status: ["draft", "sent", "accepted", "rejected", "expired"],
      service_category: ["powerpoint", "video", "branding"],
      user_role: ["admin", "sr_manager", "manager", "designer", "hr", "pm"],
    },
  },
} as const
