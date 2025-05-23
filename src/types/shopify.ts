export interface TheVoidShopProduct {
  // Standard Shopify fields
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  handle: string;
  status: 'active' | 'archived' | 'draft';
  tags: string;
  variants: TheVoidShopVariant[];
  images: TheVoidShopImage[];
  created_at: string;
  updated_at: string;
  
  // TheVoidShop custom fields
  ritualUse: string; // e.g., "protection", "manifestation", "divination"
  limitedEdition: boolean;
  dropDate: Date;
  mysticCategory: 'apparel' | 'digital-tools' | 'accessories';
  rarityLevel: 'common' | 'rare' | 'legendary' | 'cosmic';
  energyAlignment: string[]; // e.g., ["moon", "fire", "earth"]
  isDigitalItem: boolean;
}

export interface TheVoidShopVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  inventory_quantity: number;
  created_at: string;
  updated_at: string;
  
  // Custom variant fields for TheVoidShop
  sizeGuide?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'digital';
  colorHex?: string; // For apparel color matching
  downloadUrl?: string; // For digital ritual tools
}

export interface TheVoidShopImage {
  id: number;
  product_id: number;
  src: string;
  alt: string;
  created_at: string;
  updated_at: string;
  
  // Custom image metadata
  isMainProductImage: boolean;
  ritualistApproved: boolean; // Quality checked by mystic team
}

export interface VoidShopOrder {
  id: number;
  order_number: string;
  customer_email: string;
  total_price: string;
  fulfillment_status: string;
  financial_status: string;
  created_at: string;
  updated_at: string;
  line_items: OrderLineItem[];
  note_attributes: NoteAttribute[];
  
  // TheVoidShop order enhancements
  moonPhaseAtOrder: string; // Track lunar energy during purchase
  ritualInstructions?: string; // For digital items
  blessedByRitualist: boolean;
}

export interface OrderLineItem {
  id: number;
  variant_id: number;
  title: string;
  quantity: number;
  price: string;
  sku: string;
  vendor: string;
}

export interface NoteAttribute {
  name: string;
  value: string;
}

export interface WebhookEvent {
  id: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface ShopifySession {
  id: string;
  shop: string;
  accessToken: string;
  isOnline: boolean;
  scope?: string;
}

export interface VoidShopAuthData {
  shop: string;
  token: string;
  mysticLevel: 'apprentice' | 'adept' | 'master' | 'cosmic';
  session: ShopifySession;
}
