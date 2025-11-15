export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      scl_files: {
        Row: {
          id: string
          created_at: string
          file_name: string
          file_size: number
          file_url: string
          user_id: string
          project_name: string
          file_type: 'cid' | 'icd' | 'scd'
        }
        Insert: {
          id?: string
          created_at?: string
          file_name: string
          file_size: number
          file_url: string
          user_id: string
          project_name: string
          file_type: 'cid' | 'icd' | 'scd'
        }
        Update: {
          id?: string
          created_at?: string
          file_name?: string
          file_size?: number
          file_url?: string
          user_id?: string
          project_name?: string
          file_type?: 'cid' | 'icd' | 'scd'
        }
        Relationships: [
          {
            foreignKeyName: "scl_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      parsed_data: {
        Row: {
          id: string
          created_at: string
          file_id: string
          parsed_content: Json
          summary: Json
          version: string
          substation_count: number
          ied_count: number
          has_communication: boolean
          has_data_types: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          file_id: string
          parsed_content: Json
          summary: Json
          version: string
          substation_count: number
          ied_count: number
          has_communication: boolean
          has_data_types: boolean
        }
        Update: {
          id?: string
          created_at?: string
          file_id?: string
          parsed_content?: Json
          summary?: Json
          version?: string
          substation_count?: number
          ied_count?: number
          has_communication?: boolean
          has_data_types?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "parsed_data_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "scl_files"
            referencedColumns: ["id"]
          }
        ]
      }
      simulation_logs: {
        Row: {
          id: string
          created_at: string
          file_id: string
          message_type: string
          target_device: string
          parameters: Json
          response_time: number
          status: 'success' | 'error'
          result_data: Json
        }
        Insert: {
          id?: string
          created_at?: string
          file_id: string
          message_type: string
          target_device: string
          parameters: Json
          response_time: number
          status: 'success' | 'error'
          result_data: Json
        }
        Update: {
          id?: string
          created_at?: string
          file_id?: string
          message_type?: string
          target_device?: string
          parameters?: Json
          response_time?: number
          status?: 'success' | 'error'
          result_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "simulation_logs_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "scl_files"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}