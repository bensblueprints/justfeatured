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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      approval_history: {
        Row: {
          action: string
          comment: string | null
          created_at: string
          id: string
          press_release_id: string | null
          status: Database["public"]["Enums"]["review_status"]
          user_id: string | null
        }
        Insert: {
          action: string
          comment?: string | null
          created_at?: string
          id?: string
          press_release_id?: string | null
          status: Database["public"]["Enums"]["review_status"]
          user_id?: string | null
        }
        Update: {
          action?: string
          comment?: string | null
          created_at?: string
          id?: string
          press_release_id?: string | null
          status?: Database["public"]["Enums"]["review_status"]
          user_id?: string | null
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
      file_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          id: string
          is_logo: boolean | null
          post_checkout_info_id: string | null
          storage_path: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          id?: string
          is_logo?: boolean | null
          post_checkout_info_id?: string | null
          storage_path: string
        }
        Update: {
          created_at?: string
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
      post_checkout_info: {
        Row: {
          additional_notes: string | null
          business_description: string
          company_name: string
          company_website: string | null
          contact_person_name: string
          created_at: string
          custom_press_release: string | null
          email: string
          id: string
          important_dates: string | null
          industry_sector: Database["public"]["Enums"]["industry_sector"]
          key_products_services: string | null
          order_id: string | null
          phone_number: string
          preferred_tone:
            | Database["public"]["Enums"]["press_release_tone"]
            | null
          recent_achievements: string | null
          target_audience: string | null
          updated_at: string
          user_id: string | null
          write_own_release: boolean
        }
        Insert: {
          additional_notes?: string | null
          business_description: string
          company_name: string
          company_website?: string | null
          contact_person_name: string
          created_at?: string
          custom_press_release?: string | null
          email: string
          id?: string
          important_dates?: string | null
          industry_sector: Database["public"]["Enums"]["industry_sector"]
          key_products_services?: string | null
          order_id?: string | null
          phone_number: string
          preferred_tone?:
            | Database["public"]["Enums"]["press_release_tone"]
            | null
          recent_achievements?: string | null
          target_audience?: string | null
          updated_at?: string
          user_id?: string | null
          write_own_release?: boolean
        }
        Update: {
          additional_notes?: string | null
          business_description?: string
          company_name?: string
          company_website?: string | null
          contact_person_name?: string
          created_at?: string
          custom_press_release?: string | null
          email?: string
          id?: string
          important_dates?: string | null
          industry_sector?: Database["public"]["Enums"]["industry_sector"]
          key_products_services?: string | null
          order_id?: string | null
          phone_number?: string
          preferred_tone?:
            | Database["public"]["Enums"]["press_release_tone"]
            | null
          recent_achievements?: string | null
          target_audience?: string | null
          updated_at?: string
          user_id?: string | null
          write_own_release?: boolean
        }
        Relationships: []
      }
      press_releases: {
        Row: {
          actual_delivery_date: string | null
          approved_at: string | null
          approved_by: string | null
          content: string
          created_at: string
          estimated_delivery_date: string | null
          id: string
          post_checkout_info_id: string | null
          status: Database["public"]["Enums"]["review_status"]
          title: string
          updated_at: string
          user_id: string | null
          version_number: number
          word_count: number | null
        }
        Insert: {
          actual_delivery_date?: string | null
          approved_at?: string | null
          approved_by?: string | null
          content: string
          created_at?: string
          estimated_delivery_date?: string | null
          id?: string
          post_checkout_info_id?: string | null
          status?: Database["public"]["Enums"]["review_status"]
          title: string
          updated_at?: string
          user_id?: string | null
          version_number?: number
          word_count?: number | null
        }
        Update: {
          actual_delivery_date?: string | null
          approved_at?: string | null
          approved_by?: string | null
          content?: string
          created_at?: string
          estimated_delivery_date?: string | null
          id?: string
          post_checkout_info_id?: string | null
          status?: Database["public"]["Enums"]["review_status"]
          title?: string
          updated_at?: string
          user_id?: string | null
          version_number?: number
          word_count?: number | null
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
      review_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_resolved: boolean | null
          parent_comment_id: string | null
          position_end: number | null
          position_start: number | null
          press_release_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          parent_comment_id?: string | null
          position_end?: number | null
          position_start?: number | null
          press_release_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          parent_comment_id?: string | null
          position_end?: number | null
          position_start?: number | null
          press_release_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "review_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_comments_press_release_id_fkey"
            columns: ["press_release_id"]
            isOneToOne: false
            referencedRelation: "press_releases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      industry_sector:
        | "technology"
        | "healthcare"
        | "finance"
        | "retail"
        | "manufacturing"
        | "education"
        | "real_estate"
        | "hospitality"
        | "automotive"
        | "media"
        | "consulting"
        | "non_profit"
        | "government"
        | "energy"
        | "agriculture"
        | "transportation"
        | "entertainment"
        | "food_beverage"
        | "other"
      press_release_tone:
        | "professional"
        | "casual"
        | "technical"
        | "inspirational"
      review_status:
        | "draft"
        | "in_review"
        | "revision_requested"
        | "approved"
        | "published"
      user_role: "customer" | "editor" | "admin" | "super_admin"
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
      industry_sector: [
        "technology",
        "healthcare",
        "finance",
        "retail",
        "manufacturing",
        "education",
        "real_estate",
        "hospitality",
        "automotive",
        "media",
        "consulting",
        "non_profit",
        "government",
        "energy",
        "agriculture",
        "transportation",
        "entertainment",
        "food_beverage",
        "other",
      ],
      press_release_tone: [
        "professional",
        "casual",
        "technical",
        "inspirational",
      ],
      review_status: [
        "draft",
        "in_review",
        "revision_requested",
        "approved",
        "published",
      ],
      user_role: ["customer", "editor", "admin", "super_admin"],
    },
  },
} as const
