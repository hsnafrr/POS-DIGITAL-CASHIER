import { Transaction } from '../types';
import { USE_MOCK, fetchFromAPI } from './api';
import { mockTransactions } from '../data/mockData';

export async function getTransactions(): Promise<Transaction[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockTransactions]), 300);
    });
  }
  return fetchFromAPI<Transaction[]>('getTransactions', 'GET');
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transaction = mockTransactions.find((t) => t.id === id);
        resolve(transaction || null);
      }, 200);
    });
  }
  return fetchFromAPI<Transaction>('getTransactionById', 'GET', { id });
}

export async function getTransactionsByOrderId(orderId: string): Promise<Transaction[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = mockTransactions.filter((t) => t.orderId === orderId);
        resolve(transactions);
      }, 200);
    });
  }
  return fetchFromAPI<Transaction[]>('getTransactionsByOrderId', 'GET', { orderId });
}

export async function getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const filtered = mockTransactions.filter((t) => {
          const txTime = new Date(t.date).getTime();
          return txTime >= start && txTime <= end;
        });
        resolve(filtered);
      }, 250);
    });
  }
  return fetchFromAPI<Transaction[]>('getTransactionsByDateRange', 'GET', { startDate, endDate });
}

export async function getTransactionsByPaymentMethod(
  method: Transaction['paymentMethod']
): Promise<Transaction[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockTransactions.filter((t) => t.paymentMethod === method);
        resolve(filtered);
      }, 200);
    });
  }
  return fetchFromAPI<Transaction[]>('getTransactionsByPaymentMethod', 'GET', { method });
}

export async function getTransactionsByStatus(status: Transaction['status']): Promise<Transaction[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockTransactions.filter((t) => t.status === status);
        resolve(filtered);
      }, 200);
    });
  }
  return fetchFromAPI<Transaction[]>('getTransactionsByStatus', 'GET', { status });
}

export async function createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTransaction: Transaction = {
          ...transaction,
          id: `t${mockTransactions.length + 1}`,
        };
        mockTransactions.push(newTransaction);
        resolve(newTransaction);
      }, 300);
    });
  }
  return fetchFromAPI<Transaction>('createTransaction', 'POST', transaction);
}

export async function updateTransactionStatus(
  id: string,
  status: Transaction['status']
): Promise<Transaction> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transaction = mockTransactions.find((t) => t.id === id);
        if (transaction) {
          transaction.status = status;
          resolve(transaction);
        } else {
          reject(new Error('Transaction not found'));
        }
      }, 200);
    });
  }
  return fetchFromAPI<Transaction>('updateTransactionStatus', 'PUT', { id, status });
}

export async function processRefund(transactionId: string, amount: number): Promise<Transaction> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transaction = mockTransactions.find((t) => t.id === transactionId);
        if (transaction) {
          transaction.status = 'refunded';
          transaction.amount = transaction.amount - amount;
          resolve(transaction);
        } else {
          reject(new Error('Transaction not found'));
        }
      }, 300);
    });
  }
  return fetchFromAPI<Transaction>('processRefund', 'POST', { transactionId, amount });
}

export async function getDailyRevenue(date: string): Promise<number> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const targetDate = new Date(date).toDateString();
        const total = mockTransactions
          .filter((t) => new Date(t.date).toDateString() === targetDate && t.status === 'success')
          .reduce((sum, t) => sum + t.amount, 0);
        resolve(total);
      }, 200);
    });
  }
  return fetchFromAPI<number>('getDailyRevenue', 'GET', { date });
}

export async function getMonthlyRevenue(year: number, month: number): Promise<number> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = mockTransactions
          .filter((t) => {
            const txDate = new Date(t.date);
            return (
              txDate.getFullYear() === year &&
              txDate.getMonth() === month - 1 &&
              t.status === 'success'
            );
          })
          .reduce((sum, t) => sum + t.amount, 0);
        resolve(total);
      }, 250);
    });
  }
  return fetchFromAPI<number>('getMonthlyRevenue', 'GET', { year, month });
}

export async function getPaymentMethodSummary(): Promise<Record<string, number>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const summary: Record<string, number> = {};
        mockTransactions
          .filter((t) => t.status === 'success')
          .forEach((t) => {
            summary[t.paymentMethod] = (summary[t.paymentMethod] || 0) + t.amount;
          });
        resolve(summary);
      }, 200);
    });
  }
  return fetchFromAPI<Record<string, number>>('getPaymentMethodSummary', 'GET');
}
