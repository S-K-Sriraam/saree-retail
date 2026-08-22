"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, Order, OrderItem, INITIAL_PRODUCTS, INITIAL_ORDERS } from "./mock-data";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  avatar?: string;
  preferences?: string[];
  joinedDate: string;
}

export interface OtpSession {
  email: string;
  phone?: string;
  role: "customer" | "admin";
  action: "login" | "register";
  code: string;
  expiresAt: number;
  payload?: {
    name?: string;
    phone?: string;
    preferences?: string[];
    password?: string;
  };
}

interface BoutiqueContextType {
  // Auth state
  currentUser: UserProfile | null;
  adminUser: UserProfile | null;
  logoutCustomer: () => void;
  logoutAdmin: () => void;

  // OTP Auth Engine
  sendAuthOtp: (
    email: string,
    role: "customer" | "admin",
    action: "login" | "register",
    payload?: OtpSession["payload"]
  ) => Promise<{ success: boolean; otp: string }>;
  verifyAuthOtp: (
    email: string,
    enteredOtp: string
  ) => { success: boolean; error?: string; role?: "customer" | "admin"; user?: UserProfile };
  activeOtpSession: OtpSession | null;
  clearOtpSession: () => void;

  // Direct Logins if verified
  loginCustomerDirect: (email: string, name?: string, phone?: string, preferences?: string[]) => UserProfile;
  loginAdminDirect: (email: string, name?: string, phone?: string) => UserProfile;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "reviews_count" | "rating">) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;

  // Cart
  cart: OrderItem[];
  addToCart: (product: Product, quantity?: number, customization?: OrderItem["customization"], selectedColor?: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTax: number;
  cartShipping: number;
  cartTotal: number;
  couponCode: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, "id" | "orderNumber" | "date" | "status">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;

  // UI state
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const BoutiqueContext = createContext<BoutiqueContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: "gv_boutique_clean_slate_v5_prods",
  ORDERS: "gv_boutique_clean_slate_v5_ords",
  CART: "gv_boutique_clean_slate_v5_cart",
  WISHLIST: "gv_boutique_clean_slate_v5_wish",
  CUSTOMER: "gv_boutique_clean_slate_v5_cust",
  ADMIN: "gv_boutique_clean_slate_v5_adm",
  COUPON: "gv_boutique_clean_slate_v5_coup",
  OTP_SESSION: "gv_boutique_clean_slate_v5_otp"
};

export const BoutiqueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [adminUser, setAdminUser] = useState<UserProfile | null>(null);
  const [activeOtpSession, setActiveOtpSession] = useState<OtpSession | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCustomer = localStorage.getItem(STORAGE_KEYS.CUSTOMER);
      if (savedCustomer) setCurrentUser(JSON.parse(savedCustomer));

      const savedAdmin = localStorage.getItem(STORAGE_KEYS.ADMIN);
      if (savedAdmin) setAdminUser(JSON.parse(savedAdmin));

      const savedOtp = localStorage.getItem(STORAGE_KEYS.OTP_SESSION);
      if (savedOtp) {
        const parsed: OtpSession = JSON.parse(savedOtp);
        if (parsed.expiresAt > Date.now()) {
          setActiveOtpSession(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEYS.OTP_SESSION);
        }
      }

      const savedCoupon = localStorage.getItem(STORAGE_KEYS.COUPON);
      if (savedCoupon) {
        setCouponCode(savedCoupon);
        if (savedCoupon.toUpperCase() === "SILK2026") setDiscountPercent(15);
        else if (savedCoupon.toUpperCase() === "BOUTIQUE10") setDiscountPercent(10);
        else if (savedCoupon.toUpperCase() === "ROYAL500") setDiscountPercent(5);
      }
    } catch (e) {
      console.warn("Local storage parse error:", e);
    }
    setMounted(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)); } catch {}
  }, [products, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)); } catch {}
  }, [orders, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); } catch {}
  }, [cart, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist)); } catch {}
  }, [wishlist, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (currentUser) localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(currentUser));
      else localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
    } catch {}
  }, [currentUser, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (adminUser) localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(adminUser));
      else localStorage.removeItem(STORAGE_KEYS.ADMIN);
    } catch {}
  }, [adminUser, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (activeOtpSession) localStorage.setItem(STORAGE_KEYS.OTP_SESSION, JSON.stringify(activeOtpSession));
      else localStorage.removeItem(STORAGE_KEYS.OTP_SESSION);
    } catch {}
  }, [activeOtpSession, mounted]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // OTP Generation & Multi-Channel Dispatch Engine
  const sendAuthOtp = async (
    email: string,
    role: "customer" | "admin",
    action: "login" | "register",
    payload?: OtpSession["payload"]
  ): Promise<{ success: boolean; otp: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = payload?.phone?.trim();

    // Call backend OTP delivery API
    let code = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          phone: cleanPhone,
          role,
          action,
          name: payload?.name
        })
      });
      const data = await res.json();
      if (data.otp) {
        code = data.otp;
      }
    } catch (err) {
      console.warn("Backend API route call fallback:", err);
    }

    const session: OtpSession = {
      email: cleanEmail,
      phone: cleanPhone,
      role,
      action,
      code,
      expiresAt: Date.now() + 5 * 60 * 1000,
      payload
    };

    setActiveOtpSession(session);
    const targetText = cleanPhone ? `${cleanEmail} & ${cleanPhone}` : cleanEmail;
    showToast(`✨ Security Passcode Dispatched to ${targetText}. Please check your email and mobile messages.`);
    return { success: true, otp: code };
  };

  // OTP Verification Engine
  const verifyAuthOtp = (
    email: string,
    enteredOtp: string
  ): { success: boolean; error?: string; role?: "customer" | "admin"; user?: UserProfile } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = enteredOtp.trim();

    if (!activeOtpSession) {
      return { success: false, error: "No active verification session found. Please request a new OTP." };
    }

    if (activeOtpSession.email !== cleanEmail) {
      return { success: false, error: "Email mismatch for this verification session." };
    }

    if (activeOtpSession.expiresAt < Date.now()) {
      setActiveOtpSession(null);
      return { success: false, error: "Security passcode has expired. Please request a fresh code." };
    }

    if (activeOtpSession.code !== cleanOtp) {
      return { success: false, error: "Incorrect 6-digit passcode. Please check and try again." };
    }

    // OTP Verified! Complete login or registration
    const { role, payload } = activeOtpSession;

    if (role === "admin") {
      const adminName = payload?.name || cleanEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase());
      const admin = loginAdminDirect(cleanEmail, adminName, payload?.phone);
      setActiveOtpSession(null);
      return { success: true, role: "admin", user: admin };
    } else {
      const customerName = payload?.name || cleanEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase());
      const user = loginCustomerDirect(cleanEmail, customerName, payload?.phone, payload?.preferences);
      setActiveOtpSession(null);
      return { success: true, role: "customer", user };
    }
  };

  const clearOtpSession = () => {
    setActiveOtpSession(null);
    try { localStorage.removeItem(STORAGE_KEYS.OTP_SESSION); } catch {}
  };

  // Direct login methods
  const loginCustomerDirect = (email: string, name?: string, phone?: string, preferences?: string[]): UserProfile => {
    const user: UserProfile = {
      id: "cust-" + Math.random().toString(36).substring(2, 9),
      name: name || email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()),
      email: email.toLowerCase(),
      phone: phone || "+91 98450 12345",
      role: "customer",
      preferences: preferences || ["Saree Couture", "Kanchipuram Silk"],
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
    };
    setCurrentUser(user);
    showToast(`Welcome to Geethvarnam, ${user.name}!`);
    return user;
  };

  const loginAdminDirect = (email: string, name?: string, phone?: string): UserProfile => {
    const admin: UserProfile = {
      id: "admin-" + Math.random().toString(36).substring(2, 9),
      name: name || email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()),
      email: email.toLowerCase(),
      phone: phone || "",
      role: "admin",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
    };
    setAdminUser(admin);
    showToast(`Welcome to Executive Management Console, ${admin.name}!`);
    return admin;
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    showToast("Signed out of customer account.");
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    showToast("Logged out of Admin Portal.");
  };

  // Product CRUD
  const addProduct = (newProd: Omit<Product, "id" | "reviews_count" | "rating">): Product => {
    const id = `${newProd.category}-${Date.now().toString(36)}`;
    const product: Product = {
      ...newProd,
      id,
      rating: 5.0,
      reviews_count: 0
    };
    setProducts(prev => [product, ...prev]);
    showToast(`Added "${product.name}" to inventory.`);
    return product;
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    showToast("Product updated successfully.");
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Product removed from inventory.");
  };

  const getProductBySlug = (slug: string) => products.find(p => p.slug === slug || p.id === slug);
  const getProductById = (id: string) => products.find(p => p.id === id);

  // Cart Methods
  const addToCart = (
    product: Product,
    quantity = 1,
    customization?: OrderItem["customization"],
    selectedColor?: string
  ) => {
    setCart(prev => {
      const itemId = `${product.id}-${customization?.size || "standard"}-${customization?.type || "unstitched"}`;
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item => item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item);
      } else {
        const newItem: OrderItem = {
          id: itemId,
          productId: product.id,
          productName: product.name,
          category: product.category,
          image: product.images[0] || "/images/placeholder.jpg",
          price: product.base_price,
          quantity,
          selectedColor: selectedColor || product.color,
          customization
        };
        return [...prev, newItem];
      }
    });
    showToast(`Added ${product.name} to Cart`);
    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showToast("Item removed from Cart");
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode("");
    setDiscountPercent(0);
    try {
      localStorage.removeItem(STORAGE_KEYS.COUPON);
    } catch {}
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "SILK2026") {
      setCouponCode(clean);
      setDiscountPercent(15);
      try { localStorage.setItem(STORAGE_KEYS.COUPON, clean); } catch {}
      showToast("Silk Privilege 15% discount applied!");
      return { success: true, message: "15% off applied successfully!" };
    } else if (clean === "BOUTIQUE10") {
      setCouponCode(clean);
      setDiscountPercent(10);
      try { localStorage.setItem(STORAGE_KEYS.COUPON, clean); } catch {}
      showToast("Boutique Welcome 10% discount applied!");
      return { success: true, message: "10% off applied successfully!" };
    } else if (clean === "ROYAL500") {
      setCouponCode(clean);
      setDiscountPercent(5);
      try { localStorage.setItem(STORAGE_KEYS.COUPON, clean); } catch {}
      showToast("Royal festive 5% discount applied!");
      return { success: true, message: "5% off applied successfully!" };
    }
    return { success: false, message: "Invalid promo code. Try 'SILK2026' or 'BOUTIQUE10'" };
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscountPercent(0);
    try { localStorage.removeItem(STORAGE_KEYS.COUPON); } catch {}
    showToast("Promo code removed.");
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from wishlist");
        return prev.filter(id => id !== productId);
      } else {
        showToast("Added to wishlist ✨");
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Orders
  const createOrder = (orderData: Omit<Order, "id" | "orderNumber" | "date" | "status">): Order => {
    const orderNumber = `GV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now().toString(36)}`,
      orderNumber,
      date: new Date().toISOString().split("T")[0],
      status: "processing",
      trackingNumber: `GV-EXP-${Math.floor(10000 + Math.random() * 90000)}`,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order status updated to ${status.toUpperCase()}`);
  };

  // Derived calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartDiscount = (cartSubtotal * discountPercent) / 100;
  const cartTax = (cartSubtotal - cartDiscount) * 0.05;
  const cartShipping = cartSubtotal > 4999 || cartSubtotal === 0 ? 0 : 250;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartTax + cartShipping);

  return (
    <BoutiqueContext.Provider
      value={{
        currentUser,
        adminUser,
        logoutCustomer,
        logoutAdmin,
        sendAuthOtp,
        verifyAuthOtp,
        activeOtpSession,
        clearOtpSession,
        loginCustomerDirect,
        loginAdminDirect,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductBySlug,
        getProductById,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTax,
        cartShipping,
        cartTotal,
        couponCode,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        createOrder,
        updateOrderStatus,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        quickViewProduct,
        setQuickViewProduct,
        toastMessage,
        showToast
      }}
    >
      {children}
    </BoutiqueContext.Provider>
  );
};

export const useBoutique = () => {
  const context = useContext(BoutiqueContext);
  if (!context) {
    throw new Error("useBoutique must be used within a BoutiqueProvider");
  }
  return context;
};
