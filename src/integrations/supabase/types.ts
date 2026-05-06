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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          career: string
          created_at: string
          description: string
          id: string
          position: number
          title: string
        }
        Insert: {
          career: string
          created_at?: string
          description?: string
          id?: string
          position?: number
          title: string
        }
        Update: {
          career?: string
          created_at?: string
          description?: string
          id?: string
          position?: number
          title?: string
        }
        Relationships: []
      }
      drafts: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
          version: number
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          user_id: string
          version?: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      group_rooms: {
        Row: {
          created_at: string
          id: string
          name: string
          shared_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          shared_text?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          shared_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      kanban_cards: {
        Row: {
          board_key: string
          column_key: string
          created_at: string
          created_by: string | null
          id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          board_key?: string
          column_key?: string
          created_at?: string
          created_by?: string | null
          id?: string
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          board_key?: string
          column_key?: string
          created_at?: string
          created_by?: string | null
          id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentor_sessions: {
        Row: {
          created_at: string
          id: string
          mentor_id: string
          scheduled_at: string
          status: string
          student_id: string
          topic: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentor_id: string
          scheduled_at: string
          status?: string
          student_id: string
          topic?: string
        }
        Update: {
          created_at?: string
          id?: string
          mentor_id?: string
          scheduled_at?: string
          status?: string
          student_id?: string
          topic?: string
        }
        Relationships: []
      }
      micro_challenges: {
        Row: {
          created_at: string
          description: string
          id: string
          link: string
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          student_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          link: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          student_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          link?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          student_id?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          exam_mode: boolean
          expertise: string | null
          id: string
          is_professional: boolean
          study_seconds: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          exam_mode?: boolean
          expertise?: string | null
          id: string
          is_professional?: boolean
          study_seconds?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          exam_mode?: boolean
          expertise?: string | null
          id?: string
          is_professional?: boolean
          study_seconds?: number
          updated_at?: string
        }
        Relationships: []
      }
      solutions: {
        Row: {
          answer: string
          question: string
          question_key: string
        }
        Insert: {
          answer: string
          question: string
          question_key: string
        }
        Update: {
          answer?: string
          question?: string
          question_key?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string
          challenge_id: string | null
          course_id: string | null
          id: string
          kind: string
          name: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          challenge_id?: string | null
          course_id?: string | null
          id?: string
          kind?: string
          name: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          challenge_id?: string | null
          course_id?: string | null
          id?: string
          kind?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whiteboard_items: {
        Row: {
          created_at: string
          data: Json
          id: string
          kind: string
          updated_at: string
          user_id: string
          x: number | null
          y: number | null
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          kind: string
          updated_at?: string
          user_id: string
          x?: number | null
          y?: number | null
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          kind?: string
          updated_at?: string
          user_id?: string
          x?: number | null
          y?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "professional" | "admin"
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
      app_role: ["student", "professional", "admin"],
    },
  },
} as const
