import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BudgetState, Product } from '@/types';
import { getPriceForQuantity } from '@/lib/utils';

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            const { unitPrice, totalPrice } = getPriceForQuantity(product, newQuantity);
            
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: newQuantity, unitPrice, total: totalPrice }
                  : item
              ),
            };
          }

          const { unitPrice, totalPrice } = getPriceForQuantity(product, quantity);

          return {
            items: [
              ...state.items,
              {
                product,
                quantity,
                unitPrice,
                total: totalPrice,
              },
            ],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id !== productId) return item;
            
            const { unitPrice, totalPrice } = getPriceForQuantity(item.product, quantity);
            
            return {
              ...item,
              quantity,
              unitPrice,
              total: totalPrice,
            };
          }),
        }));
      },

      clearBudget: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.total, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'corpicia-budget',
    }
  )
);
