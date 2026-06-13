import { Customer } from '../types';
import { USE_MOCK, fetchFromAPI } from './api';
import { mockCustomers } from '../data/mockData';

export async function getCustomers(): Promise<Customer[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockCustomers]), 300);
    });
  }
  return fetchFromAPI<Customer[]>('getCustomers', 'GET');
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customer = mockCustomers.find((c) => c.id === id);
        resolve(customer || null);
      }, 200);
    });
  }
  return fetchFromAPI<Customer>('getCustomerById', 'GET', { id });
}

export async function getCustomerByPhone(phone: string): Promise<Customer | null> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customer = mockCustomers.find((c) => c.phone === phone);
        resolve(customer || null);
      }, 200);
    });
  }
  return fetchFromAPI<Customer>('getCustomerByPhone', 'GET', { phone });
}

export async function searchCustomers(query: string): Promise<Customer[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockCustomers.filter(
          (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.phone.includes(query) ||
            c.email.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results);
      }, 250);
    });
  }
  return fetchFromAPI<Customer[]>('searchCustomers', 'GET', { query });
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCustomer: Customer = {
          ...customer,
          id: `c${mockCustomers.length + 1}`,
          createdAt: new Date().toISOString(),
        };
        mockCustomers.push(newCustomer);
        resolve(newCustomer);
      }, 300);
    });
  }
  return fetchFromAPI<Customer>('createCustomer', 'POST', customer);
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customer = mockCustomers.find((c) => c.id === id);
        if (customer) {
          Object.assign(customer, updates);
          resolve(customer);
        } else {
          reject(new Error('Customer not found'));
        }
      }, 300);
    });
  }
  return fetchFromAPI<Customer>('updateCustomer', 'PUT', { id, ...updates });
}

export async function deleteCustomer(id: string): Promise<boolean> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockCustomers.findIndex((c) => c.id === id);
        if (index > -1) {
          mockCustomers.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  }
  return fetchFromAPI<boolean>('deleteCustomer', 'DELETE', { id });
}

export async function addLoyaltyPoints(customerId: string, points: number): Promise<Customer> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customer = mockCustomers.find((c) => c.id === customerId);
        if (customer) {
          customer.points += points;
          resolve(customer);
        } else {
          reject(new Error('Customer not found'));
        }
      }, 200);
    });
  }
  return fetchFromAPI<Customer>('addLoyaltyPoints', 'POST', { customerId, points });
}

export async function redeemLoyaltyPoints(customerId: string, points: number): Promise<Customer> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customer = mockCustomers.find((c) => c.id === customerId);
        if (customer && customer.points >= points) {
          customer.points -= points;
          resolve(customer);
        } else {
          reject(new Error('Insufficient points or customer not found'));
        }
      }, 200);
    });
  }
  return fetchFromAPI<Customer>('redeemLoyaltyPoints', 'POST', { customerId, points });
}

export async function getPremiumCustomers(): Promise<Customer[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const premium = mockCustomers.filter(
          (c) => c.membershipLevel === 'platinum' || c.membershipLevel === 'gold'
        );
        resolve(premium);
      }, 250);
    });
  }
  return fetchFromAPI<Customer[]>('getPremiumCustomers', 'GET');
}
