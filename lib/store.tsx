"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, Order, OrderItem, ColorVariant, INITIAL_PRODUCTS, INITIAL_ORDERS } from "./mock-data";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: "customer" | "admin";
  avatar?: string;
  preferences?: string[];
  joinedDate: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
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
  // Auth state & User Management
  currentUser: UserProfile | null;
  adminUser: UserProfile | null;
  allUsers: UserProfile[];
  logoutCustomer: () => void;
  logoutAdmin: () => void;
  updateCustomerProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateAdminProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateAnyUserProfile: (idOrEmail: string, updates: Partial<UserProfile>) => Promise<boolean>;
  refreshUsers: () => Promise<void>;

  // OTP Auth Engine
  sendAuthOtp: (
    email: string,
    role: "customer" | "admin",
    action: "login" | "register",
    payload?: OtpSession["payload"]
  ) => Promise<{ success: boolean; otp?: string; error?: string; userExists?: boolean }>;
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
  refreshProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "reviews_count" | "rating">) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;

  // Cart
  cart: OrderItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    customization?: OrderItem["customization"],
    selectedColor?: string,
    selectedImage?: string
  ) => void;
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
  cancelOrder: (orderId: string) => void;
  deleteOrder: (orderId: string) => void;
  clearAllOrders: () => void;

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
  PRODUCTS: "gv_boutique_fresh_slate_v6_prods",
  ORDERS: "gv_boutique_live_orders_v7",
  CART: "gv_boutique_fresh_slate_v6_cart",
  WISHLIST: "gv_boutique_fresh_slate_v6_wish",
  CUSTOMER: "gv_boutique_fresh_slate_v6_cust",
  ADMIN: "gv_boutique_fresh_slate_v6_adm",
  ALL_USERS: "gv_boutique_fresh_slate_v6_all_users",
  COUPON: "gv_boutique_fresh_slate_v6_coup",
  OTP_SESSION: "gv_boutique_fresh_slate_v6_otp"
};

export const BoutiqueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [adminUser, setAdminUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [activeOtpSession, setActiveOtpSession] = useState<OtpSession | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      // Purge old test orders caches
      localStorage.removeItem("gv_boutique_fresh_slate_v6_ords");
      localStorage.removeItem("gv_boutique_orders");

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

      const savedUsers = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (savedUsers) setAllUsers(JSON.parse(savedUsers));

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

    // Live Sync with Supabase Database
    const syncProductsFromSupabase = async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const result = await res.json();
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          setProducts(result.data);
          try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(result.data)); } catch {}
        } else {
          // Supabase is empty → push our local products up to Supabase
          const localProds = (() => {
            try {
              const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
              return saved ? JSON.parse(saved) : [];
            } catch { return []; }
          })();
          if (localProds.length > 0) {
            Promise.all(localProds.map((p: any) =>
              fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(p)
              }).catch(() => null)
            )).then(() => console.log("Local products synced to Supabase."));
          }
        }
      } catch (err) {
        console.warn("Supabase products sync note:", err);
      }
    };

    syncProductsFromSupabase();

    // Cross-tab real-time synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PRODUCTS && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) setProducts(updated);
        } catch {}
      }
      if (e.key === STORAGE_KEYS.ORDERS && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) setOrders(updated);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Auto-refresh on window focus / tab switch
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncProductsFromSupabase();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    fetch("/api/orders")
      .then(res => res.json())
      .then(result => {
        if (result.success && Array.isArray(result.data)) {
          setOrders(result.data);
          try {
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(result.data));
          } catch {}
        }
      })
    // Sync all profiles for admin management
    fetch("/api/profiles")
      .then(res => res.json())
      .then(result => {
        if (result.success && Array.isArray(result.profiles) && result.profiles.length > 0) {
          const mapped: UserProfile[] = result.profiles.map((p: any) => ({
            id: p.id || `user-${Math.random().toString(36).substring(2, 8)}`,
            name: p.name || p.full_name || p.email?.split("@")[0]?.replace(/\./g, " ") || "Client",
            email: p.email || "",
            phone: p.phone || "",
            role: p.role || "customer",
            avatar: p.avatar_url,
            preferences: p.preferences || ["Saree Couture", "Kanchipuram Silk"],
            joinedDate: p.joined_date ? new Date(p.joined_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recent",
            address: p.address || {}
          }));
          setAllUsers(mapped);
          localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(mapped));
        }
      })
      .catch(err => console.warn("Supabase profiles sync note:", err));

    setMounted(true);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
    try { localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers)); } catch {}
  }, [allUsers, mounted]);

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
  ): Promise<{ success: boolean; otp?: string; error?: string; userExists?: boolean }> => {
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

      // Surface API errors (e.g. user already exists on register)
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || "Failed to dispatch verification code.",
          userExists: data.userExists || false,
        };
      }

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
    showToast(`✨ Security Passcode Dispatched to ${cleanEmail}. Please check your email inbox.`);
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
    const cleanEmail = email.toLowerCase().trim();
    const user: UserProfile = {
      id: "cust-" + Math.random().toString(36).substring(2, 9),
      name: name || cleanEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()),
      email: cleanEmail,
      phone: phone || "",
      role: "customer",
      preferences: preferences || ["Saree Couture", "Kanchipuram Silk"],
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
    };
    setCurrentUser(user);
    showToast(`Welcome to Geethavarnam, ${user.name}!`);

    // Fetch existing customer profile from Supabase to load full saved phone and name if logging in
    fetch(`/api/profiles?email=${encodeURIComponent(cleanEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile) {
          const p = data.profile;
          const merged: UserProfile = {
            id: p.id || user.id,
            name: p.name || user.name,
            email: p.email || user.email,
            phone: p.phone || user.phone,
            role: "customer",
            preferences: p.preferences || user.preferences,
            joinedDate: p.joined_date || user.joinedDate
          };
          setCurrentUser(merged);
        } else {
          // If not in database yet, persist profile
          fetch("/api/profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
          }).catch(e => console.warn("Supabase profile sync error:", e));
        }
      })
      .catch(e => console.warn("Profile fetch note:", e));

    return user;
  };

  const loginAdminDirect = (email: string, name?: string, phone?: string): UserProfile => {
    const cleanEmail = email.toLowerCase().trim();
    const admin: UserProfile = {
      id: "admin-" + Math.random().toString(36).substring(2, 9),
      name: name || cleanEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()),
      email: cleanEmail,
      phone: phone || "",
      role: "admin",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
    };
    setAdminUser(admin);
    showToast(`Welcome to Executive Management Console, ${admin.name}!`);

    // Fetch existing admin profile from Supabase
    fetch(`/api/profiles?email=${encodeURIComponent(cleanEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile) {
          const p = data.profile;
          const merged: UserProfile = {
            id: p.id || admin.id,
            name: p.name || admin.name,
            email: p.email || admin.email,
            phone: p.phone || admin.phone,
            role: "admin",
            joinedDate: p.joined_date || admin.joinedDate
          };
          setAdminUser(merged);
        } else {
          fetch("/api/profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(admin)
          }).catch(e => console.warn("Supabase profile sync error:", e));
        }
      })
      .catch(e => console.warn("Admin profile fetch note:", e));

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

  // Customer Profile Editor
  const updateCustomerProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!currentUser) return false;
    const updated: UserProfile = {
      ...currentUser,
      ...updates,
      address: {
        ...(currentUser.address || {}),
        ...(updates.address || {})
      }
    };
    setCurrentUser(updated);
    setAllUsers(prev => {
      const idx = prev.findIndex(u => u.id === updated.id || (u.email && u.email.toLowerCase() === updated.email.toLowerCase()));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
    showToast("Profile details updated successfully ✨");

    try {
      await fetch("/api/profiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: updated.id,
          email: updated.email,
          updates: {
            name: updated.name,
            phone: updated.phone,
            password: updated.password,
            preferences: updated.preferences,
            address: updated.address,
            role: updated.role
          }
        })
      });
      return true;
    } catch (e) {
      console.warn("Supabase profile update warning:", e);
      return true;
    }
  };

  // Admin Profile Editor
  const updateAdminProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!adminUser) return false;
    const updated: UserProfile = {
      ...adminUser,
      ...updates,
      address: {
        ...(adminUser.address || {}),
        ...(updates.address || {})
      }
    };
    setAdminUser(updated);
    setAllUsers(prev => {
      const idx = prev.findIndex(u => u.id === updated.id || (u.email && u.email.toLowerCase() === updated.email.toLowerCase()));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
    showToast("Executive Admin profile updated 🛡️");

    try {
      await fetch("/api/profiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: updated.id,
          email: updated.email,
          updates: {
            name: updated.name,
            phone: updated.phone,
            password: updated.password,
            address: updated.address,
            role: updated.role
          }
        })
      });
      return true;
    } catch (e) {
      console.warn("Supabase admin profile update warning:", e);
      return true;
    }
  };

  // Admin Update Any User
  const updateAnyUserProfile = async (idOrEmail: string, updates: Partial<UserProfile>): Promise<boolean> => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === idOrEmail || (u.email && u.email.toLowerCase() === idOrEmail.toLowerCase())) {
        return {
          ...u,
          ...updates,
          address: {
            ...(u.address || {}),
            ...(updates.address || {})
          }
        };
      }
      return u;
    }));

    if (currentUser && (currentUser.id === idOrEmail || (currentUser.email && currentUser.email.toLowerCase() === idOrEmail.toLowerCase()))) {
      setCurrentUser(prev => prev ? {
        ...prev,
        ...updates,
        address: { ...(prev.address || {}), ...(updates.address || {}) }
      } : null);
    }

    if (adminUser && (adminUser.id === idOrEmail || (adminUser.email && adminUser.email.toLowerCase() === idOrEmail.toLowerCase()))) {
      setAdminUser(prev => prev ? {
        ...prev,
        ...updates,
        address: { ...(prev.address || {}), ...(updates.address || {}) }
      } : null);
    }

    showToast("User details updated successfully ✓");

    try {
      await fetch("/api/profiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: idOrEmail.startsWith("cust-") || idOrEmail.startsWith("admin-") || idOrEmail.startsWith("user-") ? undefined : idOrEmail,
          email: idOrEmail.includes("@") ? idOrEmail : undefined,
          updates
        })
      });
      return true;
    } catch (e) {
      console.warn("Supabase user update note:", e);
      return true;
    }
  };

  const refreshUsers = async () => {
    try {
      const res = await fetch("/api/profiles");
      const result = await res.json();
      if (result.success && Array.isArray(result.profiles) && result.profiles.length > 0) {
        const mapped: UserProfile[] = result.profiles.map((p: any) => ({
          id: p.id || `user-${Math.random().toString(36).substring(2, 8)}`,
          name: p.name || p.full_name || p.email?.split("@")[0]?.replace(/\./g, " ") || "Client",
          email: p.email || "",
          phone: p.phone || "",
          password: p.password || p.password_hash || "",
          role: p.role || "customer",
          avatar: p.avatar_url,
          preferences: p.preferences || ["Saree Couture", "Kanchipuram Silk"],
          joinedDate: p.joined_date ? new Date(p.joined_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recent",
          address: p.address || {}
        }));
        setAllUsers(mapped);
      }
    } catch (e) {
      console.warn("Fetch users warning:", e);
    }
  };

  // Refresh products — bidirectional sync with Supabase
  // If Supabase has products → pull them down (source of truth)
  // If Supabase is empty but we have local products → push them up first, then pull
  const refreshProducts = async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const result = await res.json();

      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        // Supabase has products — use them as source of truth
        setProducts(result.data);
        try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(result.data)); } catch {}
        showToast(`✅ Synced ${result.data.length} product(s) from database.`);
      } else {
        // Supabase is empty — push ALL local/state products up to Supabase
        const localProds = products.length > 0 ? products : (() => {
          try {
            const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
            return saved ? JSON.parse(saved) : [];
          } catch { return []; }
        })();

        if (localProds.length > 0) {
          showToast(`⏳ Uploading ${localProds.length} product(s) to database...`);

          // Push local products to Supabase
          const pushResults = await Promise.all(
            localProds.map((p: any) =>
              fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(p)
              })
                .then(r => r.json())
                .catch(err => ({ success: false, error: String(err) }))
            )
          );

          const successes = pushResults.filter((r: any) => r.success).length;
          const failures = pushResults.filter((r: any) => !r.success);

          if (failures.length > 0) {
            console.error("Sync failures:", failures.map((f: any) => f.error));
            showToast(`⚠️ ${successes} uploaded, ${failures.length} failed. Check console.`);
          }

          // Re-fetch from Supabase to confirm and get canonical data
          const verifyRes = await fetch("/api/products", { cache: "no-store" });
          const verifyResult = await verifyRes.json();
          if (verifyResult.success && Array.isArray(verifyResult.data) && verifyResult.data.length > 0) {
            setProducts(verifyResult.data);
            try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(verifyResult.data)); } catch {}
            showToast(`✅ ${verifyResult.data.length} product(s) saved to database!`);
          } else if (failures.length === 0) {
            showToast("⚠️ Products uploaded but could not verify. Check database.");
          }
        } else {
          showToast("ℹ️ No local products to sync.");
        }
      }
    } catch (e) {
      console.warn("Refresh products error:", e);
      showToast("❌ Sync failed. Check your connection.");
    }
  };

  // Product CRUD with Supabase Persistence
  const addProduct = async (newProd: Omit<Product, "id" | "reviews_count" | "rating">): Promise<Product> => {
    const id = `${newProd.category}-${Date.now().toString(36)}`;
    const product: Product = {
      ...newProd,
      id,
      subcategory: newProd.subcategory || (newProd.category === "saree" ? "Saree Couture" : "Chudar & Salwar"),
      rating: 5.0,
      reviews_count: 0
    };

    setProducts(prev => {
      const updated = [product, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast(`Added "${product.name}" to inventory.`);

    // Persist to Supabase database
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
      });
    } catch (e) {
      console.warn("Supabase product persist error:", e);
    }

    return product;
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>): Promise<boolean> => {
    let fullUpdatedProduct: Product | undefined;
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          fullUpdatedProduct = { ...p, ...updatedFields };
          return fullUpdatedProduct;
        }
        return p;
      });
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (updatedFields.stock !== undefined) {
      showToast(`Stock updated to ${updatedFields.stock} units.`);
    } else {
      showToast("Product updated successfully.");
    }

    // Persist to Supabase database with full product fallback for upsert
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          updates: updatedFields,
          product: fullUpdatedProduct
        })
      });
      const data = await res.json();
      return !!(res.ok && data.success);
    } catch (e) {
      console.warn("Supabase product update error:", e);
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast("Product removed from inventory.");

    // Persist delete to Supabase database
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      const data = await res.json();
      return !!(res.ok && data.success);
    } catch (e) {
      console.warn("Supabase product delete error:", e);
      return false;
    }
  };

  const getProductBySlug = (slug: string) => products.find(p => p.slug === slug || p.id === slug);
  const getProductById = (id: string) => products.find(p => p.id === id);

  // Cart Methods
  const addToCart = (
    product: Product,
    quantity = 1,
    customization?: OrderItem["customization"],
    selectedColor?: string,
    selectedImage?: string
  ) => {
    if ((product.stock ?? 1) <= 0) {
      showToast(`⚠️ "${product.name}" is currently out of stock.`);
      return;
    }

    setCart(prev => {
      const colorVal = selectedColor || product.color || "Default";
      const colorKey = colorVal.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const itemId = `${product.id}-${colorKey}-${customization?.size || "standard"}-${customization?.type || "unstitched"}`;
      const existing = prev.find(item => item.id === itemId);

      // Match color variant image if not explicitly provided
      const matchedVariant = product.color_variants?.find(
        v => v.name.toLowerCase() === colorVal.toLowerCase()
      );
      const itemImage = selectedImage || matchedVariant?.image || product.images[0] || "/images/placeholder.jpg";

      if (existing) {
        return prev.map(item => item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item);
      } else {
        const newItem: OrderItem = {
          id: itemId,
          productId: product.id,
          productName: product.name,
          category: product.category,
          image: itemImage,
          price: product.base_price,
          quantity,
          selectedColor: colorVal,
          customization
        };
        return [...prev, newItem];
      }
    });
    showToast(`Added ${product.name} (${selectedColor || product.color}) to Cart`);
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

    // Persist order to Supabase
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder)
    }).catch(e => console.warn("Supabase order persist error:", e));

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order status updated to ${status.toUpperCase()}`);

    // Persist status update to Supabase
    fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status })
    }).catch(e => console.warn("Supabase order status update error:", e));
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "cancelled" } : o));
    showToast("Order has been successfully cancelled.");

    // Persist status update to Supabase
    fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: "cancelled" })
    }).catch(e => console.warn("Supabase cancel order error:", e));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders.filter(o => o.id !== orderId)));
    } catch {}
    showToast("Order removed.");

    fetch(`/api/orders?id=${encodeURIComponent(orderId)}`, {
      method: "DELETE"
    }).catch(e => console.warn("Supabase delete order error:", e));
  };

  const clearAllOrders = () => {
    setOrders([]);
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    } catch {}
    showToast("All orders refreshed to 0.");

    fetch(`/api/orders?all=true`, {
      method: "DELETE"
    }).catch(e => console.warn("Supabase clear orders error:", e));
  };

  // Derived calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartDiscount = (cartSubtotal * discountPercent) / 100;
  const cartTax = 0;
  const cartShipping = cartSubtotal > 4999 || cartSubtotal === 0 ? 0 : 250;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);

  return (
    <BoutiqueContext.Provider
      value={{
        currentUser,
        adminUser,
        allUsers,
        logoutCustomer,
        logoutAdmin,
        updateCustomerProfile,
        updateAdminProfile,
        updateAnyUserProfile,
        refreshUsers,
        sendAuthOtp,
        verifyAuthOtp,
        activeOtpSession,
        clearOtpSession,
        loginCustomerDirect,
        loginAdminDirect,
        products,
        refreshProducts,
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
        cancelOrder,
        deleteOrder,
        clearAllOrders,
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
