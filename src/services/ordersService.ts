import { Order, OrderItem } from '../types';
import { USE_MOCK, fetchFromAPI } from './api';
import { mockOrders } from '../data/mockData';

let nextOrderId = 2;
let nextOrderNumber = 2;

export async function getOrders(): Promise<Order[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockOrders]), 300);
    });
  }
  return fetchFromAPI<Order[]>('getOrders', 'GET');
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = mockOrders.find((o) => o.id === id);
        resolve(order || null);
      }, 200);
    });
  }
  return fetchFromAPI<Order>('getOrderById', 'GET', { id });
}

export async function getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const filtered = mockOrders.filter((o) => {
          const orderTime = new Date(o.createdAt).getTime();
          return orderTime >= start && orderTime <= end;
        });
        resolve(filtered);
      }, 250);
    });
  }
  return fetchFromAPI<Order[]>('getOrdersByDateRange', 'GET', { startDate, endDate });
}

export async function getOrdersByStatus(status: Order['status']): Promise<Order[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockOrders.filter((o) => o.status === status);
        resolve(filtered);
      }, 200);
    });
  }
  return fetchFromAPI<Order[]>('getOrdersByStatus', 'GET', { status });
}

export async function createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder: Order = {
          ...order,
          id: `o${nextOrderId++}`,
          orderNumber: `ORD-${String(nextOrderNumber++).padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
        };
        mockOrders.push(newOrder);
        resolve(newOrder);
      }, 300);
    });
  }
  return fetchFromAPI<Order>('createOrder', 'POST', order);
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = mockOrders.find((o) => o.id === id);
        if (order) {
          order.status = status;
          resolve(order);
        } else {
          reject(new Error('Order not found'));
        }
      }, 200);
    });
  }
  return fetchFromAPI<Order>('updateOrderStatus', 'PUT', { id, status });
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = mockOrders.find((o) => o.id === id);
        if (order) {
          Object.assign(order, updates);
          resolve(order);
        } else {
          reject(new Error('Order not found'));
        }
      }, 300);
    });
  }
  return fetchFromAPI<Order>('updateOrder', 'PUT', { id, ...updates });
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockOrders.findIndex((o) => o.id === id);
        if (index > -1) {
          mockOrders.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  }
  return fetchFromAPI<boolean>('deleteOrder', 'DELETE', { id });
}

export async function calculateOrderTotal(items: OrderItem[], discount: number): Promise<{
  subtotal: number;
  tax: number;
  serviceCharge: number;
  grandTotal: number;
}> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        const afterDiscount = subtotal - discount;
        const tax = Math.round(afterDiscount * 0.1);
        const serviceCharge = Math.round(afterDiscount * 0.15);
        const grandTotal = afterDiscount + tax + serviceCharge;

        resolve({
          subtotal,
          tax,
          serviceCharge,
          grandTotal,
        });
      }, 150);
    });
  }
  return fetchFromAPI<any>('calculateOrderTotal', 'POST', { items, discount });
}
