export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          order_index: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          order_index?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          order_index?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          price_amount: number
          currency: string
          unit: string
          min_order_quantity: number
          category_id: string | null
          is_active: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          price_amount: number
          currency?: string
          unit: string
          min_order_quantity?: number
          category_id?: string | null
          is_active?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          price_amount?: number
          currency?: string
          unit?: string
          min_order_quantity?: number
          category_id?: string | null
          is_active?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          alt_text: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          alt_text?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          alt_text?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_price_tiers: {
        Row: {
          id: string
          product_id: string
          min_quantity: number
          price_amount: number
          label: string
        }
        Insert: {
          id?: string
          product_id: string
          min_quantity: number
          price_amount: number
          label: string
        }
        Update: {
          id?: string
          product_id?: string
          min_quantity?: number
          price_amount?: number
          label?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_price_tiers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_features: {
        Row: {
          id: string
          product_id: string
          feature_text: string
          order_index: number
        }
        Insert: {
          id?: string
          product_id: string
          feature_text: string
          order_index?: number
        }
        Update: {
          id?: string
          product_id?: string
          feature_text?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_features_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_specifications: {
        Row: {
          id: string
          product_id: string
          spec_key: string
          spec_value: string
          order_index: number
        }
        Insert: {
          id?: string
          product_id: string
          spec_key: string
          spec_value: string
          order_index?: number
        }
        Update: {
          id?: string
          product_id?: string
          spec_key?: string
          spec_value?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_specifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_recommendations: {
        Row: {
          id: string
          product_id: string
          recommendation_text: string
          order_index: number
        }
        Insert: {
          id?: string
          product_id: string
          recommendation_text: string
          order_index?: number
        }
        Update: {
          id?: string
          product_id?: string
          recommendation_text?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_recommendations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      banners: {
        Row: {
          id: string
          seed_key: string | null
          type: 'hero' | 'secondary'
          image_desktop: string
          image_mobile: string | null
          title: string | null
          subtitle: string | null
          cta_text: string | null
          cta_link: string | null
          order_index: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seed_key?: string | null
          type: 'hero' | 'secondary'
          image_desktop: string
          image_mobile?: string | null
          title?: string | null
          subtitle?: string | null
          cta_text?: string | null
          cta_link?: string | null
          order_index?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seed_key?: string | null
          type?: 'hero' | 'secondary'
          image_desktop?: string
          image_mobile?: string | null
          title?: string | null
          subtitle?: string | null
          cta_text?: string | null
          cta_link?: string | null
          order_index?: number
          is_active?: boolean
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
