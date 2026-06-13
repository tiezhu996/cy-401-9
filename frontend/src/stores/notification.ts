import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notificationApi } from '@/api/notification';
import type { Notification } from '@/types';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const loading = ref(false);

  async function fetchNotifications(isRead?: boolean) {
    loading.value = true;
    try {
      notifications.value = await notificationApi.list(isRead);
    } finally {
      loading.value = false;
    }
  }

  async function fetchUnreadCount() {
    try {
      const result = await notificationApi.unreadCount();
      unreadCount.value = result.count;
    } catch {
      unreadCount.value = 0;
    }
  }

  async function markAsRead(id: string) {
    try {
      const updated = await notificationApi.markAsRead(id);
      const idx = notifications.value.findIndex(n => n.id === id);
      if (idx !== -1) {
        notifications.value[idx] = updated;
      }
      if (unreadCount.value > 0) {
        unreadCount.value--;
      }
    } catch (e) {
      console.error('Failed to mark notification as read:', e);
    }
  }

  async function markAllAsRead() {
    try {
      await notificationApi.markAllAsRead();
      notifications.value.forEach(n => {
        n.isRead = true;
      });
      unreadCount.value = 0;
    } catch (e) {
      console.error('Failed to mark all notifications as read:', e);
    }
  }

  function getNotificationLink(notification: Notification): string {
    if (notification.relatedType === 'requirement') {
      return `/requirements/${notification.relatedId}`;
    }
    if (notification.relatedType === 'contract') {
      return `/contracts/${notification.relatedId}`;
    }
    return '/dashboard';
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationLink
  };
});
