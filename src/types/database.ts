export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProfileRole = "student" | "moderator" | "admin";
export type ListingStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected"
  | "archived";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type LicenseType =
  | "learning_personal"
  | "single_project"
  | "commercial";
export type PackageType =
  | "source_only"
  | "complete"
  | "complete_support"
  | "custom";
export type MediaKind = "image" | "video" | "demo";
export type OrderKind = "project" | "service";
export type OrderStatus =
  | "pending"
  | "paid"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded";
export type RequestStatus = "open" | "in_progress" | "completed" | "cancelled";
export type RequestVisibility = "public" | "private";
export type MessageKind = "text" | "system" | "attachment";

type TableDefinition<Row, RequiredInsertKeys extends keyof Row = never> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, RequiredInsertKeys>;
  Update: Partial<Row>;
  Relationships: [];
};

export type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string;
  avatar_url: string | null;
  department: string | null;
  university: string | null;
  bio: string | null;
  role: ProfileRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryRow = {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  icon_key: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  seller_id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  department: string;
  difficulty: DifficultyLevel;
  technology_tags: string[];
  base_price_bdt: number;
  status: ListingStatus;
  license_options: LicenseType[];
  included_assets: string[];
  support_duration_days: number;
  preview_metadata: Json;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectPackageRow = {
  id: string;
  project_id: string;
  name: string;
  package_type: PackageType;
  description: string;
  price_bdt: number;
  license_type: LicenseType;
  included_assets: string[];
  support_duration_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectMediaRow = {
  id: string;
  project_id: string;
  media_type: MediaKind;
  storage_path: string;
  title: string | null;
  alt_text: string | null;
  sort_order: number;
  is_public: boolean;
  preview_metadata: Json;
  created_at: string;
  updated_at: string;
};

export type ServiceRow = {
  id: string;
  seller_id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  department: string;
  technology_tags: string[];
  starting_price_bdt: number;
  status: ListingStatus;
  included_assets: string[];
  support_duration_days: number;
  service_metadata: Json;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ServicePackageRow = {
  id: string;
  service_id: string;
  name: string;
  description: string;
  price_bdt: number;
  delivery_days: number;
  revisions: number;
  included_items: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type OrderRow = {
  id: string;
  buyer_id: string;
  seller_id: string;
  item_type: OrderKind;
  project_package_id: string | null;
  service_package_id: string | null;
  status: OrderStatus;
  subtotal_bdt: number;
  platform_fee_bdt: number;
  total_bdt: number;
  currency: string;
  license_type: LicenseType | null;
  fulfillment_metadata: Json;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ReviewRow = {
  id: string;
  order_id: string;
  reviewer_id: string;
  project_id: string | null;
  service_id: string | null;
  rating: number;
  title: string | null;
  body: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type SavedItemRow = {
  id: string;
  user_id: string;
  project_id: string | null;
  service_id: string | null;
  digital_perk_id: string | null;
  created_at: string;
};

export type ProjectRequestRow = {
  id: string;
  requested_by: string;
  assigned_to: string | null;
  category_id: string | null;
  title: string;
  description: string;
  department: string | null;
  technology_tags: string[];
  budget_min_bdt: number | null;
  budget_max_bdt: number | null;
  status: RequestStatus;
  visibility: RequestVisibility;
  desired_completion_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ConversationRow = {
  id: string;
  created_by: string;
  participant_a_id: string;
  participant_b_id: string;
  order_id: string | null;
  project_request_id: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_type: MessageKind;
  body: string;
  attachment_metadata: Json;
  read_at: string | null;
  edited_at: string | null;
  created_at: string;
};

export type DigitalPerkRow = {
  id: string;
  category_id: string | null;
  created_by: string | null;
  title: string;
  slug: string;
  provider_name: string;
  description: string;
  destination_url: string;
  eligibility: string | null;
  terms: string | null;
  status: ListingStatus;
  starts_at: string | null;
  ends_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDefinition<ProfileRow, "id" | "display_name">;
      categories: TableDefinition<CategoryRow, "name" | "slug">;
      projects: TableDefinition<
        ProjectRow,
        | "seller_id"
        | "category_id"
        | "title"
        | "slug"
        | "description"
        | "department"
        | "difficulty"
        | "base_price_bdt"
      >;
      project_packages: TableDefinition<
        ProjectPackageRow,
        | "project_id"
        | "name"
        | "package_type"
        | "description"
        | "price_bdt"
        | "license_type"
      >;
      project_media: TableDefinition<
        ProjectMediaRow,
        "project_id" | "media_type" | "storage_path"
      >;
      services: TableDefinition<
        ServiceRow,
        | "seller_id"
        | "category_id"
        | "title"
        | "slug"
        | "description"
        | "department"
        | "starting_price_bdt"
      >;
      service_packages: TableDefinition<
        ServicePackageRow,
        | "service_id"
        | "name"
        | "description"
        | "price_bdt"
        | "delivery_days"
      >;
      orders: TableDefinition<
        OrderRow,
        | "buyer_id"
        | "seller_id"
        | "item_type"
        | "subtotal_bdt"
        | "total_bdt"
      >;
      reviews: TableDefinition<
        ReviewRow,
        "order_id" | "reviewer_id" | "rating" | "body"
      >;
      saved_items: TableDefinition<SavedItemRow, "user_id">;
      project_requests: TableDefinition<
        ProjectRequestRow,
        "requested_by" | "title" | "description"
      >;
      conversations: TableDefinition<
        ConversationRow,
        "created_by" | "participant_a_id" | "participant_b_id"
      >;
      messages: TableDefinition<
        MessageRow,
        "conversation_id" | "sender_id" | "body"
      >;
      digital_perks: TableDefinition<
        DigitalPerkRow,
        "title" | "slug" | "provider_name" | "description" | "destination_url"
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      can_review_order: {
        Args: {
          target_order_id: string;
          target_project_id: string | null;
          target_service_id: string | null;
        };
        Returns: boolean;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      profile_role: ProfileRole;
      listing_status: ListingStatus;
      difficulty_level: DifficultyLevel;
      license_type: LicenseType;
      package_type: PackageType;
      media_kind: MediaKind;
      order_kind: OrderKind;
      order_status: OrderStatus;
      request_status: RequestStatus;
      request_visibility: RequestVisibility;
      message_kind: MessageKind;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
