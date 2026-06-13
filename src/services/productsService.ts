import { Product } from '../types';
import { USE_MOCK, fetchFromAPI } from './api';
import { mockProducts } from '../data/mockData';

export async function getProducts(): Promise<Product[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockProducts), 300);
    });
  }
  return fetchFromAPI<Product[]>('getProducts', 'GET');
}

export async function getProductById(id: string): Promise<Product | null> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts.find((p) => p.id === id);
        resolve(product || null);
      }, 200);
    });
  }
  return fetchFromAPI<Product>('getProductById', 'GET', { id });
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = mockProducts.filter((p) => p.category === category);
        resolve(products);
      }, 250);
    });
  }
  return fetchFromAPI<Product[]>('getProductsByCategory', 'GET', { category });
}

export async function getBestSellers(): Promise<Product[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const best = mockProducts.filter((p) => p.isBestSeller);
        resolve(best);
      }, 200);
    });
  }
  return fetchFromAPI<Product[]>('getBestSellers', 'GET');
}

export async function getPromoProducts(): Promise<Product[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const promos = mockProducts.filter((p) => p.isPromo);
        resolve(promos);
      }, 200);
    });
  }
  return fetchFromAPI<Product[]>('getPromoProducts', 'GET');
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct: Product = {
          ...product,
          id: `p${mockProducts.length + 1}`,
        };
        mockProducts.push(newProduct);
        resolve(newProduct);
      }, 300);
    });
  }
  return fetchFromAPI<Product>('createProduct', 'POST', product);
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts.find((p) => p.id === id);
        if (product) {
          Object.assign(product, updates);
          resolve(product);
        } else {
          reject(new Error('Product not found'));
        }
      }, 300);
    });
  }
  return fetchFromAPI<Product>('updateProduct', 'PUT', { id, ...updates });
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockProducts.findIndex((p) => p.id === id);
        if (index > -1) {
          mockProducts.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  }
  return fetchFromAPI<boolean>('deleteProduct', 'DELETE', { id });
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results);
      }, 250);
    });
  }
  return fetchFromAPI<Product[]>('searchProducts', 'GET', { query });
}
