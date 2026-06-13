import { create } from 'zustand';
import { Notification } from '../types';

interface AppStoreState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentOutlet: string;
  setOutlet: (outlet: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  currentOutlet: 'Jakarta - SCBD',
  setOutlet: (outlet) =>
    set({
      currentOutlet: outlet,
    }),

  searchQuery: '',
  setSearchQuery: (query) =>
    set({
      searchQuery: query,
    }),

  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: `notif-${Date.now()}`,
          read: false,
        },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  clearNotifications: () =>
    set({
      notifications: [],
    }),

  language: 'id',
  setLanguage: (lang) =>
    set({
      language: lang,
    }),
}));
