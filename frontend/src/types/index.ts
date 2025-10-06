export interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
}

export interface Item {
  _id: string;
  name: string;
  slug: string;
  category: {_id: string; name: string;};
  company?: string;
  description?: string;
  cost_price: number;
  min_profit_percent: number;
  max_profit_percent: number;
  sale_price_min: number;
  sale_price_max: number;
  stock: number;
  reorder_level: number;
  photos: string[];
}

export interface User {
  _id: string;
  email: string;
  name?: string;
  role: "admin" | "user" | "superadmin";
  createdAt?: string;
}

export type UserRole = "admin" | "user" | "superadmin";
