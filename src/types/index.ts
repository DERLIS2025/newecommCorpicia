export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  pricePerM2: number;
  unit: 'm2' | 'docena' | 'unidad' | 'visita';
  minQuantity: number;
  images: string[];
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface BudgetItem {
  product: Product;
  quantity: number;
  total: number;
}

export interface BudgetState {
  items: BudgetItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearBudget: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}
