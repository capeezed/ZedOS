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
      projects: {
        Row: {
          id: string
          slug: string
          name: string
          description: string
          status: "active" | "paused" | "backlog" | "archived"
          priority: "high" | "medium" | "low"
          area: string
          stack: string[]
          next_action: string
          notes_count: number
          snippets_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string
          status?: "active" | "paused" | "backlog" | "archived"
          priority?: "high" | "medium" | "low"
          area?: string
          stack?: string[]
          next_action?: string
          notes_count?: number
          snippets_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string
          status?: "active" | "paused" | "backlog" | "archived"
          priority?: "high" | "medium" | "low"
          area?: string
          stack?: string[]
          next_action?: string
          notes_count?: number
          snippets_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_notes: {
        Row: {
          id: string
          project_id: string
          title: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
