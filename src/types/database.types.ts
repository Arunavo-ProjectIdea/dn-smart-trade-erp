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
      bills_of_entry: {
        Row: {
          boe_number: string
          created_at: string | null
          duties_ait: number | null
          duties_at: number | null
          duties_grand_total: number | null
          duties_import_duty: number | null
          duties_other_charges: number | null
          duties_vat: number | null
          id: string
          notes: string | null
          shipment_id: string
          status: Database["public"]["Enums"]["boe_status"] | null
          updated_at: string | null
        }
        Insert: {
          boe_number: string
          created_at?: string | null
          duties_ait?: number | null
          duties_at?: number | null
          duties_grand_total?: number | null
          duties_import_duty?: number | null
          duties_other_charges?: number | null
          duties_vat?: number | null
          id?: string
          notes?: string | null
          shipment_id: string
          status?: Database["public"]["Enums"]["boe_status"] | null
          updated_at?: string | null
        }
        Update: {
          boe_number?: string
          created_at?: string | null
          duties_ait?: number | null
          duties_at?: number | null
          duties_grand_total?: number | null
          duties_import_duty?: number | null
          duties_other_charges?: number | null
          duties_vat?: number | null
          id?: string
          notes?: string | null
          shipment_id?: string
          status?: Database["public"]["Enums"]["boe_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bills_of_entry_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: true
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      boe_products: {
        Row: {
          boe_id: string
          currency: string
          declared_value: number
          hs_code: string | null
          id: string
          product_name: string
          quantity: number
          unit: string
        }
        Insert: {
          boe_id: string
          currency: string
          declared_value: number
          hs_code?: string | null
          id?: string
          product_name: string
          quantity: number
          unit: string
        }
        Update: {
          boe_id?: string
          currency?: string
          declared_value?: number
          hs_code?: string | null
          id?: string
          product_name?: string
          quantity?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "boe_products_boe_id_fkey"
            columns: ["boe_id"]
            isOneToOne: false
            referencedRelation: "bills_of_entry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boe_products_hs_code_fkey"
            columns: ["hs_code"]
            isOneToOne: false
            referencedRelation: "hs_codes"
            referencedColumns: ["code"]
          },
        ]
      }
      boe_timeline: {
        Row: {
          author_id: string | null
          boe_id: string
          date: string
          id: string
          note: string | null
          status: string
        }
        Insert: {
          author_id?: string | null
          boe_id: string
          date?: string
          id?: string
          note?: string | null
          status: string
        }
        Update: {
          author_id?: string | null
          boe_id?: string
          date?: string
          id?: string
          note?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "boe_timeline_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boe_timeline_boe_id_fkey"
            columns: ["boe_id"]
            isOneToOne: false
            referencedRelation: "bills_of_entry"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string
          bin_number: string | null
          client_type: Database["public"]["Enums"]["client_type"] | null
          company_name: string
          contact_person: string
          created_at: string | null
          email: string
          id: string
          notes: string | null
          phone: string
          status: Database["public"]["Enums"]["client_status"] | null
          tin_number: string | null
          trade_license_number: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          bin_number?: string | null
          client_type?: Database["public"]["Enums"]["client_type"] | null
          company_name: string
          contact_person: string
          created_at?: string | null
          email: string
          id?: string
          notes?: string | null
          phone: string
          status?: Database["public"]["Enums"]["client_status"] | null
          tin_number?: string | null
          trade_license_number?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          bin_number?: string | null
          client_type?: Database["public"]["Enums"]["client_type"] | null
          company_name?: string
          contact_person?: string
          created_at?: string | null
          email?: string
          id?: string
          notes?: string | null
          phone?: string
          status?: Database["public"]["Enums"]["client_status"] | null
          tin_number?: string | null
          trade_license_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      document_activities: {
        Row: {
          action: string
          actor_id: string | null
          date: string | null
          details: string | null
          document_id: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          date?: string | null
          details?: string | null
          document_id: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          date?: string | null
          details?: string | null
          document_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_activities_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_activities_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          changes_note: string | null
          document_id: string
          file_size: number
          file_url: string
          id: string
          uploaded_at: string | null
          uploaded_by_id: string | null
          version_number: number
        }
        Insert: {
          changes_note?: string | null
          document_id: string
          file_size: number
          file_url: string
          id?: string
          uploaded_at?: string | null
          uploaded_by_id?: string | null
          version_number: number
        }
        Update: {
          changes_note?: string | null
          document_id?: string
          file_size?: number
          file_url?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by_id?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_versions_uploaded_by_id_fkey"
            columns: ["uploaded_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          boe_id: string | null
          category: Database["public"]["Enums"]["document_category"]
          client_id: string | null
          current_file_url: string
          description: string | null
          file_size: number | null
          file_type: string
          id: string
          last_modified: string | null
          name: string
          shipment_id: string | null
          status: Database["public"]["Enums"]["document_status"] | null
          tags: string[] | null
          type: string
          upload_date: string | null
          uploaded_by_id: string | null
        }
        Insert: {
          boe_id?: string | null
          category: Database["public"]["Enums"]["document_category"]
          client_id?: string | null
          current_file_url: string
          description?: string | null
          file_size?: number | null
          file_type: string
          id?: string
          last_modified?: string | null
          name: string
          shipment_id?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          tags?: string[] | null
          type: string
          upload_date?: string | null
          uploaded_by_id?: string | null
        }
        Update: {
          boe_id?: string | null
          category?: Database["public"]["Enums"]["document_category"]
          client_id?: string | null
          current_file_url?: string
          description?: string | null
          file_size?: number | null
          file_type?: string
          id?: string
          last_modified?: string | null
          name?: string
          shipment_id?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          tags?: string[] | null
          type?: string
          upload_date?: string | null
          uploaded_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_boe_id_fkey"
            columns: ["boe_id"]
            isOneToOne: false
            referencedRelation: "bills_of_entry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_id_fkey"
            columns: ["uploaded_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hs_codes: {
        Row: {
          ait: number | null
          category: string
          cd: number | null
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          policy_notes: string | null
          rd: number | null
          required_documents: Json | null
          sd: number | null
          uom: string
          updated_at: string | null
          vat: number | null
        }
        Insert: {
          ait?: number | null
          category: string
          cd?: number | null
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          policy_notes?: string | null
          rd?: number | null
          required_documents?: Json | null
          sd?: number | null
          uom: string
          updated_at?: string | null
          vat?: number | null
        }
        Update: {
          ait?: number | null
          category?: string
          cd?: number | null
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          policy_notes?: string | null
          rd?: number | null
          required_documents?: Json | null
          sd?: number | null
          uom?: string
          updated_at?: string | null
          vat?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json
          description: string
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean
          priority: Database["public"]["Enums"]["notification_priority"]
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          description: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          priority?: Database["public"]["Enums"]["notification_priority"]
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          description?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          priority?: Database["public"]["Enums"]["notification_priority"]
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          client_id: string | null
          created_at: string | null
          department: string | null
          designation: string | null
          email: string
          force_password_change: boolean | null
          full_name: string
          id: string
          last_login: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          force_password_change?: boolean | null
          full_name: string
          id: string
          last_login?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          client_id?: string | null
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email?: string
          force_password_change?: boolean | null
          full_name?: string
          id?: string
          last_login?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_products: {
        Row: {
          hs_code: string | null
          id: string
          name: string
          quantity: number
          shipment_id: string
          weight: number | null
        }
        Insert: {
          hs_code?: string | null
          id?: string
          name: string
          quantity: number
          shipment_id: string
          weight?: number | null
        }
        Update: {
          hs_code?: string | null
          id?: string
          name?: string
          quantity?: number
          shipment_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_products_hs_code_fkey"
            columns: ["hs_code"]
            isOneToOne: false
            referencedRelation: "hs_codes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "shipment_products_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_timeline: {
        Row: {
          created_at: string | null
          date: string
          id: string
          location: string | null
          notes: string | null
          responsible_employee_id: string | null
          shipment_id: string
          status: string
          time: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          location?: string | null
          notes?: string | null
          responsible_employee_id?: string | null
          shipment_id: string
          status: string
          time?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          location?: string | null
          notes?: string | null
          responsible_employee_id?: string | null
          shipment_id?: string
          status?: string
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_timeline_responsible_employee_id_fkey"
            columns: ["responsible_employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_timeline_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          arrival_port: string | null
          assigned_employee_id: string | null
          client_id: string
          consignee: string
          container_number: string | null
          container_size: string | null
          container_type: string | null
          created_at: string | null
          departure_date: string | null
          destination_country: string
          discharge_port: string | null
          eta: string | null
          etd: string | null
          exporter: string
          gross_weight: number | null
          id: string
          incoterms: string | null
          loading_port: string | null
          net_weight: number | null
          origin_country: string
          package_count: number | null
          package_type: string | null
          shipment_number: string
          shipping_line: string | null
          status: Database["public"]["Enums"]["shipment_status"] | null
          transport_type: Database["public"]["Enums"]["transport_type"] | null
          updated_at: string | null
          vessel_name: string | null
          voyage_number: string | null
        }
        Insert: {
          arrival_port?: string | null
          assigned_employee_id?: string | null
          client_id: string
          consignee: string
          container_number?: string | null
          container_size?: string | null
          container_type?: string | null
          created_at?: string | null
          departure_date?: string | null
          destination_country: string
          discharge_port?: string | null
          eta?: string | null
          etd?: string | null
          exporter: string
          gross_weight?: number | null
          id?: string
          incoterms?: string | null
          loading_port?: string | null
          net_weight?: number | null
          origin_country: string
          package_count?: number | null
          package_type?: string | null
          shipment_number: string
          shipping_line?: string | null
          status?: Database["public"]["Enums"]["shipment_status"] | null
          transport_type?: Database["public"]["Enums"]["transport_type"] | null
          updated_at?: string | null
          vessel_name?: string | null
          voyage_number?: string | null
        }
        Update: {
          arrival_port?: string | null
          assigned_employee_id?: string | null
          client_id?: string
          consignee?: string
          container_number?: string | null
          container_size?: string | null
          container_type?: string | null
          created_at?: string | null
          departure_date?: string | null
          destination_country?: string
          discharge_port?: string | null
          eta?: string | null
          etd?: string | null
          exporter?: string
          gross_weight?: number | null
          id?: string
          incoterms?: string | null
          loading_port?: string | null
          net_weight?: number | null
          origin_country?: string
          package_count?: number | null
          package_type?: string | null
          shipment_number?: string
          shipping_line?: string | null
          status?: Database["public"]["Enums"]["shipment_status"] | null
          transport_type?: Database["public"]["Enums"]["transport_type"] | null
          updated_at?: string | null
          vessel_name?: string | null
          voyage_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_assigned_employee_id_fkey"
            columns: ["assigned_employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_client_id: { Args: never; Returns: string }
      get_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      create_notification: {
        Args: {
          p_user_id: string
          p_type: Database["public"]["Enums"]["notification_type"]
          p_priority: Database["public"]["Enums"]["notification_priority"]
          p_title: string
          p_description: string
          p_entity_id?: string | null
          p_entity_type?: string | null
          p_data?: Json
        }
        Returns: string
      }
    }
    Enums: {
      boe_status:
        | "Draft"
        | "Submitted"
        | "Under Review"
        | "Approved"
        | "Rejected"
        | "Completed"
      client_status: "Active" | "Pending" | "Inactive"
      client_type: "Importer" | "Exporter" | "Both"
      document_category:
        | "Shipment Documents"
        | "BOE Documents"
        | "Client Documents"
        | "Financial Documents"
        | "Compliance Documents"
      document_status:
        | "Pending Review"
        | "Approved"
        | "Rejected"
        | "Archived"
        | "Expired"
      notification_priority: "low" | "medium" | "high" | "urgent"
      notification_type: "shipment" | "boe" | "document" | "system"
      shipment_status:
        | "Pending"
        | "Booked"
        | "Loaded"
        | "In Transit"
        | "Arrived"
        | "Customs Clearance"
        | "Released"
        | "Delivered"
        | "Delayed"
      transport_type: "Sea" | "Air" | "Land"
      user_role: "Admin" | "Employee" | "Client"
      user_status: "Active" | "Inactive" | "Pending"
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
      boe_status: [
        "Draft",
        "Submitted",
        "Under Review",
        "Approved",
        "Rejected",
        "Completed",
      ],
      client_status: ["Active", "Pending", "Inactive"],
      client_type: ["Importer", "Exporter", "Both"],
      document_category: [
        "Shipment Documents",
        "BOE Documents",
        "Client Documents",
        "Financial Documents",
        "Compliance Documents",
      ],
      document_status: [
        "Pending Review",
        "Approved",
        "Rejected",
        "Archived",
        "Expired",
      ],
      notification_priority: ["low", "medium", "high", "urgent"],
      notification_type: ["shipment", "boe", "document", "system"],
      shipment_status: [
        "Pending",
        "Booked",
        "Loaded",
        "In Transit",
        "Arrived",
        "Customs Clearance",
        "Released",
        "Delivered",
        "Delayed",
      ],
      transport_type: ["Sea", "Air", "Land"],
      user_role: ["Admin", "Employee", "Client"],
      user_status: ["Active", "Inactive", "Pending"],
    },
  },
} as const
