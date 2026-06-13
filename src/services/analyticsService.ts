import { AnalyticsData, DashboardKPI } from '../types';
import { USE_MOCK, fetchFromAPI } from './api';
import { mockAnalyticsData, mockDashboardKPI, mockOrders, mockTransactions } from '../data/mockData';

export async function getAnalyticsData(): Promise<AnalyticsData> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...mockAnalyticsData }), 400);
    });
  }
  return fetchFromAPI<AnalyticsData>('getAnalyticsData', 'GET');
}

export async function getDashboardKPI(): Promise<DashboardKPI> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...mockDashboardKPI }), 300);
    });
  }
  return fetchFromAPI<DashboardKPI>('getDashboardKPI', 'GET');
}

export async function getRevenueByMonth(year: number): Promise<Array<{ month: string; revenue: number }>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const revenue = mockAnalyticsData.revenueByMonth;
        resolve(revenue);
      }, 300);
    });
  }
  return fetchFromAPI<Array<{ month: string; revenue: number }>>('getRevenueByMonth', 'GET', { year });
}

export async function getOrdersByDay(): Promise<Array<{ day: string; count: number }>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = mockAnalyticsData.ordersByDay;
        resolve(orders);
      }, 250);
    });
  }
  return fetchFromAPI<Array<{ day: string; count: number }>>('getOrdersByDay', 'GET');
}

export async function getCategorySales(): Promise<Array<{ category: string; sales: number }>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sales = mockAnalyticsData.categorySales;
        resolve(sales);
      }, 250);
    });
  }
  return fetchFromAPI<Array<{ category: string; sales: number }>>('getCategorySales', 'GET');
}

export async function getPeakHours(): Promise<Array<{ hour: number; orders: number }>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const hours = mockAnalyticsData.peakHours;
        resolve(hours);
      }, 250);
    });
  }
  return fetchFromAPI<Array<{ hour: number; orders: number }>>('getPeakHours', 'GET');
}

export async function getTopProducts(): Promise<
  Array<{ productId: string; productName: string; sold: number; revenue: number }>
> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const productStats: Record<string, { sold: number; revenue: number; name: string }> = {};
        mockOrders.forEach((order) => {
          order.items.forEach((item) => {
            if (!productStats[item.product.id]) {
              productStats[item.product.id] = { sold: 0, revenue: 0, name: item.product.name };
            }
            productStats[item.product.id].sold += item.qty;
            productStats[item.product.id].revenue += item.subtotal;
          });
        });

        const results = Object.entries(productStats)
          .map(([productId, stats]) => ({
            productId,
            productName: stats.name,
            sold: stats.sold,
            revenue: stats.revenue,
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10);

        resolve(results);
      }, 300);
    });
  }
  return fetchFromAPI<Array<{ productId: string; productName: string; sold: number; revenue: number }>>(
    'getTopProducts',
    'GET'
  );
}

export async function getCustomerMetrics(): Promise<{
  totalCustomers: number;
  newCustomersThisMonth: number;
  repeatCustomers: number;
  avgCustomerValue: number;
}> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const metrics = {
          totalCustomers: 142,
          newCustomersThisMonth: 18,
          repeatCustomers: 124,
          avgCustomerValue: 35268,
        };
        resolve(metrics);
      }, 200);
    });
  }
  return fetchFromAPI<any>('getCustomerMetrics', 'GET');
}

export async function getInventoryMetrics(): Promise<{
  lowStockItems: number;
  totalInventoryValue: number;
  turnoverRate: number;
}> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const metrics = {
          lowStockItems: 3,
          totalInventoryValue: 45000000,
          turnoverRate: 2.8,
        };
        resolve(metrics);
      }, 200);
    });
  }
  return fetchFromAPI<any>('getInventoryMetrics', 'GET');
}

export async function getPaymentMethodStats(): Promise<
  Array<{ method: string; count: number; total: number; percentage: number }>
> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats: Record<string, { count: number; total: number }> = {
          cash: { count: 0, total: 0 },
          card: { count: 0, total: 0 },
          digital: { count: 0, total: 0 },
        };

        mockTransactions
          .filter((t) => t.status === 'success')
          .forEach((t) => {
            stats[t.paymentMethod].count += 1;
            stats[t.paymentMethod].total += t.amount;
          });

        const totalAmount = Object.values(stats).reduce((sum, s) => sum + s.total, 0);

        const results = Object.entries(stats).map(([method, data]) => ({
          method,
          count: data.count,
          total: data.total,
          percentage: totalAmount > 0 ? Math.round((data.total / totalAmount) * 100) : 0,
        }));

        resolve(results);
      }, 300);
    });
  }
  return fetchFromAPI<any>('getPaymentMethodStats', 'GET');
}

export async function getOutletComparison(): Promise<
  Array<{ outletName: string; orders: number; revenue: number; avgOrder: number }>
> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const outlets: Record<string, { orders: number; revenue: number }> = {};
        mockTransactions.forEach((t) => {
          if (!outlets[t.outletName]) {
            outlets[t.outletName] = { orders: 0, revenue: 0 };
          }
          outlets[t.outletName].orders += 1;
          outlets[t.outletName].revenue += t.amount;
        });

        const results = Object.entries(outlets)
          .map(([outletName, data]) => ({
            outletName,
            orders: data.orders,
            revenue: data.revenue,
            avgOrder: Math.round(data.revenue / data.orders),
          }))
          .sort((a, b) => b.revenue - a.revenue);

        resolve(results);
      }, 300);
    });
  }
  return fetchFromAPI<any>('getOutletComparison', 'GET');
}
