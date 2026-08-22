export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "saree" | "chudar";
  subcategory: string;
  base_price: number;
  compare_price?: number;
  fabric: string;
  weave_type?: string;
  work_type?: string;
  color: string;
  color_code: string;
  description: string;
  short_description: string;
  sku: string;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  rating: number;
  reviews_count: number;
  images: string[];
  three_d_preset?: "kanchipuram" | "banarasi" | "organza" | "velvet" | "chiffon";
  details: {
    length?: string;
    blouse_piece?: string;
    dupatta?: string;
    bottom_type?: string;
    wash_care: string;
    occasion: string;
    origin?: string;
  };
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  userCity: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  category: "saree" | "chudar";
  image: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  customization?: {
    type: "unstitched" | "standard" | "custom_tailored";
    size?: string; // S, M, L, XL, XXL
    blouseStitching?: boolean;
    fallPico?: boolean;
    bottomStyle?: string; // Chudar, Palazzo, Cigarette Pant
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "handcrafted" | "shipped" | "delivered";
  paymentMethod: "upi" | "card" | "netbanking" | "cod";
  trackingNumber?: string;
  estimatedDelivery?: string;
}

// 100% Clean Real-Time Inventory & Orders Slate (Zero Mock Data)
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_REVIEWS: Review[] = [];

export const BOUTIQUE_CATEGORIES = [
  { id: "all", name: "All Collections", count: 0 },
  { id: "saree", name: "Saree Couture", count: 0, subcategories: ["Kanchipuram Silk", "Banarasi Silk", "Organza Sarees", "Chiffon & Georgette"] },
  { id: "chudar", name: "Chudar & Salwar Sets", count: 0, subcategories: ["Anarkali Suits", "Straight Cut Salwar", "Palazzo Suits", "Sharara & Gharara Sets"] }
];

export const FABRICS_LIST = [
  "All Fabrics",
  "100% Pure Mulberry Silk",
  "Katan Silk",
  "Pure Sheer Tissue Organza",
  "Pure Viscose Chiffon",
  "Micro Velvet & Net",
  "Pure Chanderi Silk",
  "Fox Georgette with Santoon Lining",
  "Pure Banarasi Silk Brocade"
];
