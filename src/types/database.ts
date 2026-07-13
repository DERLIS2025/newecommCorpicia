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
      }
      banners: {
        Row: {
          id: string
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
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          is_public: boolean
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          is_public?: boolean
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          is_public?: boolean
          updated_at?: string
        }
      }
    }
  }
}
