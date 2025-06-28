import { create } from 'zustand';
import { UIState, Notification } from '../../shared/types';

interface UIStore extends UIState {
  // Actions
  setCurrentView: (view: UIState['currentView']) => void;
  setLoading: (isLoading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  toggleModal: (modal: keyof UIState['modals'], open?: boolean) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  currentView: 'dashboard',
  isLoading: false,
  notifications: [],
  modals: {
    settings: false,
    meetingDetails: false,
  },

  // Actions
  setCurrentView: view => {
    set({ currentView: view });
  },

  setLoading: isLoading => {
    set({ isLoading });
  },

  addNotification: notificationData => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    set(state => ({
      notifications: [notification, ...state.notifications],
    }));

    // Auto-remove success notifications after 5 seconds
    if (notification.type === 'success') {
      setTimeout(() => {
        get().removeNotification(notification.id);
      }, 5000);
    }
  },

  removeNotification: id => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  markNotificationAsRead: id => {
    set(state => ({
      notifications: state.notifications.map(n => (n.id === id ? { ...n, read: true } : n)),
    }));
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  },

  toggleModal: (modal, open) => {
    set(state => ({
      modals: {
        ...state.modals,
        [modal]: open !== undefined ? open : !state.modals[modal],
      },
    }));
  },
}));
