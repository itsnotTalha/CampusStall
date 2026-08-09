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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon_key: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_key?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_key?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          context_metadata: Json
          created_at: string
          created_by: string
          id: string
          last_message_at: string | null
          order_id: string | null
          participant_a_id: string
          participant_b_id: string
          project_id: string | null
          project_request_id: string | null
          updated_at: string
        }
        Insert: {
          context_metadata?: Json
          created_at?: string
          created_by: string
          id?: string
          last_message_at?: string | null
          order_id?: string | null
          participant_a_id: string
          participant_b_id: string
          project_id?: string | null
          project_request_id?: string | null
          updated_at?: string
        }
        Update: {
          context_metadata?: Json
          created_at?: string
          created_by?: string
          id?: string
          last_message_at?: string | null
          order_id?: string | null
          participant_a_id?: string
          participant_b_id?: string
          project_id?: string | null
          project_request_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_a_id_fkey"
            columns: ["participant_a_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_b_id_fkey"
            columns: ["participant_b_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_project_request_id_fkey"
            columns: ["project_request_id"]
            isOneToOne: false
            referencedRelation: "project_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_perks: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string
          destination_url: string
          eligibility: string | null
          ends_at: string | null
          id: string
          provider_name: string
          published_at: string | null
          slug: string
          starts_at: string | null
          status: Database["public"]["Enums"]["listing_status"]
          terms: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          destination_url: string
          eligibility?: string | null
          ends_at?: string | null
          id?: string
          provider_name: string
          published_at?: string | null
          slug: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          terms?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          destination_url?: string
          eligibility?: string | null
          ends_at?: string | null
          id?: string
          provider_name?: string
          published_at?: string | null
          slug?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          terms?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "digital_perks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "digital_perks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_metadata: Json
          body: string
          conversation_id: string
          created_at: string
          edited_at: string | null
          id: string
          message_type: Database["public"]["Enums"]["message_kind"]
          read_at: string | null
          sender_id: string
        }
        Insert: {
          attachment_metadata?: Json
          body: string
          conversation_id: string
          created_at?: string
          edited_at?: string | null
          id?: string
          message_type?: Database["public"]["Enums"]["message_kind"]
          read_at?: string | null
          sender_id: string
        }
        Update: {
          attachment_metadata?: Json
          body?: string
          conversation_id?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          message_type?: Database["public"]["Enums"]["message_kind"]
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          completed_at: string | null
          created_at: string
          currency: string
          fulfillment_metadata: Json
          id: string
          item_type: Database["public"]["Enums"]["order_kind"]
          license_type: Database["public"]["Enums"]["license_type"] | null
          platform_fee_bdt: number
          project_package_id: string | null
          seller_id: string
          service_package_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal_bdt: number
          total_bdt: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          completed_at?: string | null
          created_at?: string
          currency?: string
          fulfillment_metadata?: Json
          id?: string
          item_type: Database["public"]["Enums"]["order_kind"]
          license_type?: Database["public"]["Enums"]["license_type"] | null
          platform_fee_bdt?: number
          project_package_id?: string | null
          seller_id: string
          service_package_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_bdt: number
          total_bdt: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          completed_at?: string | null
          created_at?: string
          currency?: string
          fulfillment_metadata?: Json
          id?: string
          item_type?: Database["public"]["Enums"]["order_kind"]
          license_type?: Database["public"]["Enums"]["license_type"] | null
          platform_fee_bdt?: number
          project_package_id?: string | null
          seller_id?: string
          service_package_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_bdt?: number
          total_bdt?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_project_package_id_fkey"
            columns: ["project_package_id"]
            isOneToOne: false
            referencedRelation: "project_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_service_package_id_fkey"
            columns: ["service_package_id"]
            isOneToOne: false
            referencedRelation: "service_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          display_name: string
          id: string
          is_seller: boolean
          is_verified: boolean
          role: Database["public"]["Enums"]["profile_role"]
          university: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          display_name: string
          id: string
          is_seller?: boolean
          is_verified?: boolean
          role?: Database["public"]["Enums"]["profile_role"]
          university?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          display_name?: string
          id?: string
          is_seller?: boolean
          is_verified?: boolean
          role?: Database["public"]["Enums"]["profile_role"]
          university?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      project_media: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          is_public: boolean
          media_type: Database["public"]["Enums"]["media_kind"]
          preview_metadata: Json
          project_id: string
          sort_order: number
          storage_path: string
          title: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          media_type: Database["public"]["Enums"]["media_kind"]
          preview_metadata?: Json
          project_id: string
          sort_order?: number
          storage_path: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          media_type?: Database["public"]["Enums"]["media_kind"]
          preview_metadata?: Json
          project_id?: string
          sort_order?: number
          storage_path?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_files: {
        Row: {
          created_at: string
          id: string
          mime_type: string
          original_filename: string
          project_id: string
          size_bytes: number
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          mime_type: string
          original_filename: string
          project_id: string
          size_bytes: number
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          mime_type?: string
          original_filename?: string
          project_id?: string
          size_bytes?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_customization_requests: {
        Row: {
          accepted_at: string | null
          budget_bdt: number
          buyer_id: string
          completed_at: string | null
          created_at: string
          deadline: string
          id: string
          note: string | null
          project_id: string
          project_slug: string
          project_title: string
          requested_changes: string
          seller_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["customization_request_status"]
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          budget_bdt: number
          buyer_id: string
          completed_at?: string | null
          created_at?: string
          deadline: string
          id?: string
          note?: string | null
          project_id: string
          project_slug: string
          project_title: string
          requested_changes: string
          seller_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["customization_request_status"]
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          budget_bdt?: number
          buyer_id?: string
          completed_at?: string | null
          created_at?: string
          deadline?: string
          id?: string
          note?: string | null
          project_id?: string
          project_slug?: string
          project_title?: string
          requested_changes?: string
          seller_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["customization_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_customization_requests_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_customization_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_customization_requests_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_packages: {
        Row: {
          created_at: string
          description: string
          id: string
          included_assets: string[]
          is_active: boolean
          license_type: Database["public"]["Enums"]["license_type"]
          name: string
          package_type: Database["public"]["Enums"]["package_type"]
          price_bdt: number
          project_id: string
          support_duration_days: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          included_assets?: string[]
          is_active?: boolean
          license_type: Database["public"]["Enums"]["license_type"]
          name: string
          package_type: Database["public"]["Enums"]["package_type"]
          price_bdt: number
          project_id: string
          support_duration_days?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          included_assets?: string[]
          is_active?: boolean
          license_type?: Database["public"]["Enums"]["license_type"]
          name?: string
          package_type?: Database["public"]["Enums"]["package_type"]
          price_bdt?: number
          project_id?: string
          support_duration_days?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_packages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_requests: {
        Row: {
          assigned_to: string | null
          budget_max_bdt: number | null
          budget_min_bdt: number | null
          category_id: string | null
          created_at: string
          department: string | null
          description: string
          desired_completion_date: string | null
          id: string
          requested_by: string
          status: Database["public"]["Enums"]["request_status"]
          technology_tags: string[]
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["request_visibility"]
        }
        Insert: {
          assigned_to?: string | null
          budget_max_bdt?: number | null
          budget_min_bdt?: number | null
          category_id?: string | null
          created_at?: string
          department?: string | null
          description: string
          desired_completion_date?: string | null
          id?: string
          requested_by: string
          status?: Database["public"]["Enums"]["request_status"]
          technology_tags?: string[]
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["request_visibility"]
        }
        Update: {
          assigned_to?: string | null
          budget_max_bdt?: number | null
          budget_min_bdt?: number | null
          category_id?: string | null
          created_at?: string
          department?: string | null
          description?: string
          desired_completion_date?: string | null
          id?: string
          requested_by?: string
          status?: Database["public"]["Enums"]["request_status"]
          technology_tags?: string[]
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["request_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "project_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          base_price_bdt: number
          category_id: string
          created_at: string
          department: string
          description: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          included_assets: string[]
          license_options: Database["public"]["Enums"]["license_type"][]
          preview_metadata: Json
          published_at: string | null
          requirements: string
          seller_id: string
          slug: string
          status: Database["public"]["Enums"]["listing_status"]
          support_duration_days: number
          technology_tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          base_price_bdt: number
          category_id: string
          created_at?: string
          department: string
          description: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          included_assets?: string[]
          license_options?: Database["public"]["Enums"]["license_type"][]
          preview_metadata?: Json
          published_at?: string | null
          requirements?: string
          seller_id: string
          slug: string
          status?: Database["public"]["Enums"]["listing_status"]
          support_duration_days?: number
          technology_tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          base_price_bdt?: number
          category_id?: string
          created_at?: string
          department?: string
          description?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          included_assets?: string[]
          license_options?: Database["public"]["Enums"]["license_type"][]
          preview_metadata?: Json
          published_at?: string | null
          requirements?: string
          seller_id?: string
          slug?: string
          status?: Database["public"]["Enums"]["listing_status"]
          support_duration_days?: number
          technology_tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string
          created_at: string
          id: string
          is_published: boolean
          order_id: string
          project_id: string | null
          rating: number
          reviewer_id: string
          service_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_published?: boolean
          order_id: string
          project_id?: string | null
          rating: number
          reviewer_id: string
          service_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_published?: boolean
          order_id?: string
          project_id?: string | null
          rating?: number
          reviewer_id?: string
          service_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_items: {
        Row: {
          created_at: string
          digital_perk_id: string | null
          id: string
          project_id: string | null
          service_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          digital_perk_id?: string | null
          id?: string
          project_id?: string | null
          service_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          digital_perk_id?: string | null
          id?: string
          project_id?: string | null
          service_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_items_digital_perk_id_fkey"
            columns: ["digital_perk_id"]
            isOneToOne: false
            referencedRelation: "digital_perks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_packages: {
        Row: {
          created_at: string
          delivery_days: number
          description: string
          id: string
          included_items: string[]
          is_active: boolean
          name: string
          price_bdt: number
          revisions: number
          service_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_days: number
          description: string
          id?: string
          included_items?: string[]
          is_active?: boolean
          name: string
          price_bdt: number
          revisions?: number
          service_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_days?: number
          description?: string
          id?: string
          included_items?: string[]
          is_active?: boolean
          name?: string
          price_bdt?: number
          revisions?: number
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_packages_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category_id: string
          created_at: string
          department: string
          description: string
          id: string
          included_assets: string[]
          published_at: string | null
          seller_id: string
          service_metadata: Json
          slug: string
          starting_price_bdt: number
          status: Database["public"]["Enums"]["listing_status"]
          support_duration_days: number
          technology_tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          department: string
          description: string
          id?: string
          included_assets?: string[]
          published_at?: string | null
          seller_id: string
          service_metadata?: Json
          slug: string
          starting_price_bdt: number
          status?: Database["public"]["Enums"]["listing_status"]
          support_duration_days?: number
          technology_tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          department?: string
          description?: string
          id?: string
          included_assets?: string[]
          published_at?: string | null
          seller_id?: string
          service_metadata?: Json
          slug?: string
          starting_price_bdt?: number
          status?: Database["public"]["Enums"]["listing_status"]
          support_duration_days?: number
          technology_tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_review_order: {
        Args: {
          target_order_id: string
          target_project_id: string
          target_service_id: string
        }
        Returns: boolean
      }
      can_access_project_file: {
        Args: { target_storage_path: string }
        Returns: boolean
      }
      complete_demo_project_payment: {
        Args: { target_order_id: string }
        Returns: Database["public"]["Enums"]["order_status"]
      }
      create_demo_project_order: {
        Args: { target_package_id: string }
        Returns: string
      }
      create_project_customization_request: {
        Args: {
          optional_note?: string
          proposed_budget_bdt: number
          requested_changes: string
          requested_deadline: string
          target_project_id: string
        }
        Returns: string
      }
      get_entitled_project_file: {
        Args: { target_order_id: string }
        Returns: {
          original_filename: string
          storage_path: string
        }[]
      }
      get_or_create_order_conversation: {
        Args: { target_order_id: string }
        Returns: string
      }
      get_or_create_project_conversation: {
        Args: { target_project_id: string }
        Returns: string
      }
      is_admin: { Args: never; Returns: boolean }
      mark_conversation_read: {
        Args: { target_conversation_id: string }
        Returns: number
      }
      send_conversation_message: {
        Args: { message_body: string; target_conversation_id: string }
        Returns: string
      }
      transition_project_order: {
        Args: {
          target_order_id: string
          target_status: Database["public"]["Enums"]["order_status"]
        }
        Returns: Database["public"]["Enums"]["order_status"]
      }
      transition_project_customization_request: {
        Args: {
          target_request_id: string
          target_status: Database["public"]["Enums"]["customization_request_status"]
        }
        Returns: Database["public"]["Enums"]["customization_request_status"]
      }
    }
    Enums: {
      customization_request_status:
        | "pending"
        | "accepted"
        | "declined"
        | "in_progress"
        | "completed"
        | "cancelled"
      difficulty_level: "beginner" | "intermediate" | "advanced"
      license_type: "learning_personal" | "single_project" | "commercial"
      listing_status:
        | "draft"
        | "pending"
        | "published"
        | "rejected"
        | "archived"
      media_kind: "image" | "video" | "demo"
      message_kind: "text" | "system" | "attachment"
      order_kind: "project" | "service"
      order_status:
        | "pending"
        | "paid"
        | "delivered"
        | "completed"
        | "cancelled"
        | "refunded"
      package_type: "source_only" | "complete" | "complete_support" | "custom"
      profile_role: "student" | "moderator" | "admin"
      request_status: "open" | "in_progress" | "completed" | "cancelled"
      request_visibility: "public" | "private"
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
      customization_request_status: [
        "pending",
        "accepted",
        "declined",
        "in_progress",
        "completed",
        "cancelled",
      ],
      difficulty_level: ["beginner", "intermediate", "advanced"],
      license_type: ["learning_personal", "single_project", "commercial"],
      listing_status: ["draft", "pending", "published", "rejected", "archived"],
      media_kind: ["image", "video", "demo"],
      message_kind: ["text", "system", "attachment"],
      order_kind: ["project", "service"],
      order_status: [
        "pending",
        "paid",
        "delivered",
        "completed",
        "cancelled",
        "refunded",
      ],
      package_type: ["source_only", "complete", "complete_support", "custom"],
      profile_role: ["student", "moderator", "admin"],
      request_status: ["open", "in_progress", "completed", "cancelled"],
      request_visibility: ["public", "private"],
    },
  },
} as const
