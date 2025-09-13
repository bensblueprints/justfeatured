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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      approval_history: {
        Row: {
          action: string
          comment: string | null
          created_at: string | null
          id: string
          press_release_id: string | null
          status: Database["public"]["Enums"]["press_release_status"]
          user_id: string
        }
        Insert: {
          action: string
          comment?: string | null
          created_at?: string | null
          id?: string
          press_release_id?: string | null
          status: Database["public"]["Enums"]["press_release_status"]
          user_id: string
        }
        Update: {
          action?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          press_release_id?: string | null
          status?: Database["public"]["Enums"]["press_release_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_history_press_release_id_fkey"
            columns: ["press_release_id"]
            isOneToOne: false
            referencedRelation: "press_releases"
            referencedColumns: ["id"]
          },
        ]
      }
      email_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          metadata: Json | null
          source: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          metadata?: Json | null
          source: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          metadata?: Json | null
          source?: string
        }
        Relationships: []
      }
      file_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          is_logo: boolean | null
          post_checkout_info_id: string | null
          storage_path: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          is_logo?: boolean | null
          post_checkout_info_id?: string | null
          storage_path: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          is_logo?: boolean | null
          post_checkout_info_id?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_attachments_post_checkout_info_id_fkey"
            columns: ["post_checkout_info_id"]
            isOneToOne: false
            referencedRelation: "post_checkout_info"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          category: string | null
          created_at: string
          custom_price: number | null
          id: string
          invoice_id: string
          publication_id: string | null
          publication_name: string
          quantity: number
          tier: string | null
          unit_price: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          custom_price?: number | null
          id?: string
          invoice_id: string
          publication_id?: string | null
          publication_name: string
          quantity?: number
          tier?: string | null
          unit_price?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          custom_price?: number | null
          id?: string
          invoice_id?: string
          publication_id?: string | null
          publication_name?: string
          quantity?: number
          tier?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_company: string | null
          client_email: string
          client_name: string
          created_at: string
          created_by: string
          due_date: string | null
          id: string
          invoice_number: string
          notes: string | null
          payment_token: string
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_company?: string | null
          client_email: string
          client_name: string
          created_at?: string
          created_by: string
          due_date?: string | null
          id?: string
          invoice_number: string
          notes?: string | null
          payment_token?: string
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          client_company?: string | null
          client_email?: string
          client_name?: string
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          payment_token?: string
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      popup_emails: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      post_checkout_info: {
        Row: {
          additional_info: string | null
          additional_notes: string | null
          budget_range: string | null
          business_description: string | null
          company_name: string
          company_website: string | null
          contact_email: string
          contact_person_name: string | null
          contact_phone: string | null
          created_at: string | null
          custom_press_release: string | null
          email: string | null
          id: string
          important_dates: string | null
          industry: string | null
          industry_sector: string | null
          key_messages: string | null
          key_products_services: string | null
          phone_number: string | null
          preferred_timeline: string | null
          preferred_tone: string | null
          recent_achievements: string | null
          status: Database["public"]["Enums"]["checkout_status"] | null
          target_audience: string | null
          updated_at: string | null
          user_id: string
          write_own_release: boolean | null
        }
        Insert: {
          additional_info?: string | null
          additional_notes?: string | null
          budget_range?: string | null
          business_description?: string | null
          company_name: string
          company_website?: string | null
          contact_email: string
          contact_person_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          custom_press_release?: string | null
          email?: string | null
          id?: string
          important_dates?: string | null
          industry?: string | null
          industry_sector?: string | null
          key_messages?: string | null
          key_products_services?: string | null
          phone_number?: string | null
          preferred_timeline?: string | null
          preferred_tone?: string | null
          recent_achievements?: string | null
          status?: Database["public"]["Enums"]["checkout_status"] | null
          target_audience?: string | null
          updated_at?: string | null
          user_id: string
          write_own_release?: boolean | null
        }
        Update: {
          additional_info?: string | null
          additional_notes?: string | null
          budget_range?: string | null
          business_description?: string | null
          company_name?: string
          company_website?: string | null
          contact_email?: string
          contact_person_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          custom_press_release?: string | null
          email?: string | null
          id?: string
          important_dates?: string | null
          industry?: string | null
          industry_sector?: string | null
          key_messages?: string | null
          key_products_services?: string | null
          phone_number?: string | null
          preferred_timeline?: string | null
          preferred_tone?: string | null
          recent_achievements?: string | null
          status?: Database["public"]["Enums"]["checkout_status"] | null
          target_audience?: string | null
          updated_at?: string | null
          user_id?: string
          write_own_release?: boolean | null
        }
        Relationships: []
      }
      press_releases: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_checkout_info_id: string | null
          status: Database["public"]["Enums"]["press_release_status"] | null
          title: string
          updated_at: string | null
          user_id: string
          version_number: number | null
          word_count: number
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_checkout_info_id?: string | null
          status?: Database["public"]["Enums"]["press_release_status"] | null
          title: string
          updated_at?: string | null
          user_id: string
          version_number?: number | null
          word_count?: number
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_checkout_info_id?: string | null
          status?: Database["public"]["Enums"]["press_release_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          version_number?: number | null
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "press_releases_post_checkout_info_id_fkey"
            columns: ["post_checkout_info_id"]
            isOneToOne: false
            referencedRelation: "post_checkout_info"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          category: string
          cbd: boolean | null
          contact_info: string
          created_at: string | null
          crypto: boolean | null
          da_score: number | null
          description: string | null
          dofollow_link: boolean | null
          dr_score: number | null
          erotic: boolean | null
          external_id: string | null
          features: string[] | null
          gambling: boolean | null
          health: boolean | null
          id: string
          indexed: boolean | null
          is_active: boolean | null
          location: string | null
          logo_url: string | null
          monthly_readers: number
          name: string
          popularity: number | null
          price: number
          sponsored: boolean | null
          status: Database["public"]["Enums"]["publication_status"] | null
          tat_days: string | null
          tier: string | null
          type: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          category: string
          cbd?: boolean | null
          contact_info: string
          created_at?: string | null
          crypto?: boolean | null
          da_score?: number | null
          description?: string | null
          dofollow_link?: boolean | null
          dr_score?: number | null
          erotic?: boolean | null
          external_id?: string | null
          features?: string[] | null
          gambling?: boolean | null
          health?: boolean | null
          id?: string
          indexed?: boolean | null
          is_active?: boolean | null
          location?: string | null
          logo_url?: string | null
          monthly_readers?: number
          name: string
          popularity?: number | null
          price?: number
          sponsored?: boolean | null
          status?: Database["public"]["Enums"]["publication_status"] | null
          tat_days?: string | null
          tier?: string | null
          type?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          category?: string
          cbd?: boolean | null
          contact_info?: string
          created_at?: string | null
          crypto?: boolean | null
          da_score?: number | null
          description?: string | null
          dofollow_link?: boolean | null
          dr_score?: number | null
          erotic?: boolean | null
          external_id?: string | null
          features?: string[] | null
          gambling?: boolean | null
          health?: boolean | null
          id?: string
          indexed?: boolean | null
          is_active?: boolean | null
          location?: string | null
          logo_url?: string | null
          monthly_readers?: number
          name?: string
          popularity?: number | null
          price?: number
          sponsored?: boolean | null
          status?: Database["public"]["Enums"]["publication_status"] | null
          tat_days?: string | null
          tier?: string | null
          type?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_publications_for_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          cbd: boolean
          contact_info: string
          created_at: string
          crypto: boolean
          da_score: number
          description: string
          dofollow_link: boolean
          dr_score: number
          erotic: boolean
          external_id: string
          features: string[]
          gambling: boolean
          health: boolean
          id: string
          indexed: boolean
          is_active: boolean
          location: string
          logo_url: string
          monthly_readers: number
          name: string
          popularity: number
          price: number
          sponsored: boolean
          status: Database["public"]["Enums"]["publication_status"]
          tat_days: string
          tier: string
          type: string
          updated_at: string
          website_url: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "super_admin"
        | "editor"
        | "customer"
      checkout_status: "pending" | "in_progress" | "completed" | "cancelled"
      press_release_status:
        | "draft"
        | "submitted"
        | "approved"
        | "published"
        | "rejected"
        | "in_review"
        | "revision_requested"
      publication_status: "active" | "inactive"
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
  public: {
    Enums: {
      app_role: [
        "admin",
        "moderator",
        "user",
        "super_admin",
        "editor",
        "customer",
      ],
      checkout_status: ["pending", "in_progress", "completed", "cancelled"],
      press_release_status: [
        "draft",
        "submitted",
        "approved",
        "published",
        "rejected",
        "in_review",
        "revision_requested",
      ],
      publication_status: ["active", "inactive"],
    },
  },
} as const
