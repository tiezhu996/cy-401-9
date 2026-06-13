import { http } from './http';
import type { Notification, UnreadCount } from '@/types';

export const notificationApi = {
  list(isRead?: boolean) {
    const params = isRead !== undefined ? { isRead: String(isRead) } : {};
    return http.get<unknown, Notification[]>('/notifications', { params });
  },
  unreadCount() {
    return http.get<unknown, UnreadCount>('/notifications/unread-count');
  },
  markAsRead(id: string) {
    return http.put<unknown, Notification>(`/notifications/${id}/read`);
  },
  markAllAsRead() {
    return http.put<unknown, { success: boolean }>('/notifications/read-all');
  }
};
