import { create } from 'zustand';
import { OrderItem, Product } from '../types';

interface OrderStoreState {
  currentOrder: {
    items: OrderItem[];
    tableNumber?: number;
    customerName?: string;
    orderType: 'dine-in' | 'takeaway' | 'delivery';
    discount: number;
    notes?: string;
  };
  paymentMethod: 'cash' | 'card' | 'digital' | 'pending';
  isProcessing: boolean;
  isPaid: boolean;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  grandTotal: number;
  addItem: (
    product: Product,
    qty: number,
    notes?: string,
    addons?: string[],
    toppings?: string[]
  ) => void;
  removeItem: (itemId: string) => void;
  updateItemQty: (itemId: string, qty: number) => void;
  setTableNumber: (tableNumber?: number) => void;
  setCustomerName: (customerName?: string) => void;
  setOrderType: (orderType: 'dine-in' | 'takeaway' | 'delivery') => void;
  setDiscount: (discount: number) => void;
  setNotes: (notes?: string) => void;
  setPaymentMethod: (method: 'cash' | 'card' | 'digital' | 'pending') => void;
  setIsProcessing: (processing: boolean) => void;
  setIsPaid: (paid: boolean) => void;
  clearOrder: () => void;
  calculateTotals: () => void;
}

export const useOrderStore = create<OrderStoreState>((set, get) => ({
  currentOrder: {
    items: [],
    orderType: 'dine-in',
    discount: 0,
  },
  paymentMethod: 'pending',
  isProcessing: false,
  isPaid: false,
  subtotal: 0,
  tax: 0,
  serviceCharge: 0,
  grandTotal: 0,

  addItem: (product, qty, notes = '', addons = [], toppings = []) => {
    set((state) => {
      const existingItem = state.currentOrder.items.find(
        (item) => item.product.id === product.id && item.notes === notes && JSON.stringify(item.addons) === JSON.stringify(addons) && JSON.stringify(item.toppings) === JSON.stringify(toppings)
      );

      let updatedItems: OrderItem[];
      if (existingItem) {
        updatedItems = state.currentOrder.items.map((item) =>
          item.id === existingItem.id
            ? {
                ...item,
                qty: item.qty + qty,
                subtotal: (item.qty + qty) * product.price,
              }
            : item
        );
      } else {
        const newItem: OrderItem = {
          id: `oi-${Date.now()}-${Math.random()}`,
          product,
          qty,
          notes,
          addons,
          toppings,
          subtotal: qty * product.price,
        };
        updatedItems = [...state.currentOrder.items, newItem];
      }

      return {
        currentOrder: {
          ...state.currentOrder,
          items: updatedItems,
        },
      };
    });
    get().calculateTotals();
  },

  removeItem: (itemId) => {
    set((state) => ({
      currentOrder: {
        ...state.currentOrder,
        items: state.currentOrder.items.filter((item) => item.id !== itemId),
      },
    }));
    get().calculateTotals();
  },

  updateItemQty: (itemId, qty) => {
    set((state) => {
      const updatedItems = state.currentOrder.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            qty: Math.max(0, qty),
            subtotal: Math.max(0, qty) * item.product.price,
          };
        }
        return item;
      });

      return {
        currentOrder: {
          ...state.currentOrder,
          items: updatedItems.filter((item) => item.qty > 0),
        },
      };
    });
    get().calculateTotals();
  },

  setTableNumber: (tableNumber) => {
    set((state) => ({
      currentOrder: {
        ...state.currentOrder,
        tableNumber,
      },
    }));
  },

  setCustomerName: (customerName) => {
    set((state) => ({
      currentOrder: {
        ...state.currentOrder,
        customerName,
      },
    }));
  },

  setOrderType: (orderType) => {
    set((state) => ({
      currentOrder: {
        ...state.currentOrder,
        orderType,
      },
    }));
  },

  setDiscount: (discount) => {
    set((state) => ({
      currentOrder: {
        ...state.currentOrder,
        discount: Math.max(0, discount),
      },
    }));
    get().calculateTotals();
  },

  setNotes: (notes) => {
    set((state) => ({
      currentOrder: {
        ...state.currentOrder,
        notes,
      },
    }));
  },

  setPaymentMethod: (method) => {
    set({ paymentMethod: method });
  },

  setIsProcessing: (processing) => {
    set({ isProcessing: processing });
  },

  setIsPaid: (paid) => {
    set({ isPaid: paid });
  },

  clearOrder: () => {
    set({
      currentOrder: {
        items: [],
        orderType: 'dine-in',
        discount: 0,
      },
      paymentMethod: 'pending',
      isProcessing: false,
      isPaid: false,
      subtotal: 0,
      tax: 0,
      serviceCharge: 0,
      grandTotal: 0,
    });
  },

  calculateTotals: () => {
    set((state) => {
      const subtotal = state.currentOrder.items.reduce((sum, item) => sum + item.subtotal, 0);
      const afterDiscount = subtotal - state.currentOrder.discount;
      const tax = Math.round(afterDiscount * 0.1);
      const serviceCharge = Math.round(afterDiscount * 0.15);
      const grandTotal = afterDiscount + tax + serviceCharge;

      return {
        subtotal,
        tax,
        serviceCharge,
        grandTotal,
      };
    });
  },
}));
