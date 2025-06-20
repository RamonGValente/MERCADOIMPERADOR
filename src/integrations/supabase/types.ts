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
      cash_registers: {
        Row: {
          closed_at: string | null
          closing_amount: number | null
          id: string
          opened_at: string | null
          opening_amount: number
          status: string | null
          total_sales: number | null
          user_id: string | null
        }
        Insert: {
          closed_at?: string | null
          closing_amount?: number | null
          id?: string
          opened_at?: string | null
          opening_amount: number
          status?: string | null
          total_sales?: number | null
          user_id?: string | null
        }
        Update: {
          closed_at?: string | null
          closing_amount?: number | null
          id?: string
          opened_at?: string | null
          opening_amount?: number
          status?: string | null
          total_sales?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_registers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      combo_products: {
        Row: {
          combo_id: string | null
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number
        }
        Insert: {
          combo_id?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
        }
        Update: {
          combo_id?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "combo_products_combo_id_fkey"
            columns: ["combo_id"]
            isOneToOne: false
            referencedRelation: "promotional_combos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combo_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          address: string | null
          created_at: string | null
          delivery_base_fee: number | null
          delivery_per_km: number | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          delivery_base_fee?: number | null
          delivery_per_km?: number | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          delivery_base_fee?: number | null
          delivery_per_km?: number | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          neighborhood: string | null
          phone: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          neighborhood?: string | null
          phone?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          neighborhood?: string | null
          phone?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      financial_movements: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          order_id: string | null
          paid_date: string | null
          payment_method: string | null
          status: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          order_id?: string | null
          paid_date?: string | null
          payment_method?: string | null
          status?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          order_id?: string | null
          paid_date?: string | null
          payment_method?: string | null
          status?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_movements_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          cost_per_unit: number | null
          created_at: string | null
          current_stock: number | null
          id: string
          min_stock: number | null
          name: string
          supplier_id: string | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          cost_per_unit?: number | null
          created_at?: string | null
          current_stock?: number | null
          id?: string
          min_stock?: number | null
          name: string
          supplier_id?: string | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          cost_per_unit?: number | null
          created_at?: string | null
          current_stock?: number | null
          id?: string
          min_stock?: number | null
          name?: string
          supplier_id?: string | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_options: {
        Row: {
          created_at: string | null
          id: string
          option_id: string | null
          order_item_id: string | null
          quantity: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_id?: string | null
          order_item_id?: string | null
          quantity?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          option_id?: string | null
          order_item_id?: string | null
          quantity?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_options_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "product_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_options_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          combo_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          order_id: string | null
          product_id: string | null
          quantity: number
          status: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          combo_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          product_id?: string | null
          quantity: number
          status?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          combo_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          status?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_combo_id_fkey"
            columns: ["combo_id"]
            isOneToOne: false
            referencedRelation: "promotional_combos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string | null
          delivery_address: string | null
          delivery_distance: number | null
          delivery_fee: number | null
          discount: number | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string | null
          status: string | null
          subtotal: number
          table_id: string | null
          total: number
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: string | null
          delivery_distance?: number | null
          delivery_fee?: number | null
          discount?: number | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          subtotal?: number
          table_id?: string | null
          total?: number
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: string | null
          delivery_distance?: number | null
          delivery_fee?: number | null
          discount?: number | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          subtotal?: number
          table_id?: string | null
          total?: number
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_options: {
        Row: {
          created_at: string | null
          id: string
          is_required: boolean | null
          name: string
          price: number
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          name: string
          price?: number
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          name?: string
          price?: number
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_recipes: {
        Row: {
          created_at: string | null
          id: string
          ingredient_id: string | null
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          product_id?: string | null
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_recipes_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_recipes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category_id: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          min_stock: number | null
          name: string
          price: number
          stock_quantity: number | null
          unit_type: string
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_stock?: number | null
          name: string
          price: number
          stock_quantity?: number | null
          unit_type: string
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_stock?: number | null
          name?: string
          price?: number
          stock_quantity?: number | null
          unit_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      promotional_combos: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string | null
          id: string
          ingredient_id: string | null
          product_id: string | null
          quantity: number
          reason: string | null
          total_cost: number | null
          type: string
          unit_cost: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          product_id?: string | null
          quantity: number
          reason?: string | null
          total_cost?: number | null
          type: string
          unit_cost?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          product_id?: string | null
          quantity?: number
          reason?: string | null
          total_cost?: number | null
          type?: string
          unit_cost?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          cnpj: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          cnpj?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          cnpj?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tables: {
        Row: {
          capacity: number | null
          created_at: string | null
          id: string
          number: number
          status: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          id?: string
          number: number
          status?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          id?: string
          number?: number
          status?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          role?: string
          updated_at?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
