<template>
  <el-dropdown
    trigger="click"
    @visible-change="handleVisibleChange"
    class="notification-dropdown"
  >
    <div class="bell-wrapper">
      <el-badge :value="notificationStore.unreadCount" :hidden="notificationStore.unreadCount === 0" :max="99" class="notification-badge">
        <el-icon :size="20" class="bell-icon"><Bell /></el-icon>
      </el-badge>
    </div>
    <template #dropdown>
      <el-dropdown-menu class="notification-menu">
        <div class="notification-header">
          <span class="header-title">消息通知</span>
          <el-button
            v-if="notificationStore.unreadCount > 0"
            type="primary"
            link
            size="small"
            @click.stop="handleMarkAllRead"
          >
            全部已读
          </el-button>
        </div>
        <el-tabs v-model="activeTab" class="notification-tabs">
          <el-tab-pane label="未读" name="unread">
            <div class="notification-list" v-loading="notificationStore.loading">
              <div
                v-for="item in unreadNotifications"
                :key="item.id"
                class="notification-item unread"
                @click="handleClickItem(item)"
              >
                <div class="item-left">
                  <div class="dot"></div>
                  <el-icon class="type-icon" :class="`type-${item.type}`">
                    <component :is="getTypeIcon(item.type)" />
                  </el-icon>
                </div>
                <div class="item-content">
                  <div class="item-title">{{ item.title }}</div>
                  <div class="item-desc">{{ item.content }}</div>
                  <div class="item-time">{{ formatTime(item.createdAt) }}</div>
                </div>
              </div>
              <div v-if="!notificationStore.loading && unreadNotifications.length === 0" class="empty-state">
                <el-empty description="暂无未读消息" :image-size="80" />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="已读" name="read">
            <div class="notification-list" v-loading="notificationStore.loading">
              <div
                v-for="item in readNotifications"
                :key="item.id"
                class="notification-item"
                @click="handleClickItem(item)"
              >
                <div class="item-left">
                  <el-icon class="type-icon" :class="`type-${item.type}`">
                    <component :is="getTypeIcon(item.type)" />
                  </el-icon>
                </div>
                <div class="item-content">
                  <div class="item-title">{{ item.title }}</div>
                  <div class="item-desc">{{ item.content }}</div>
                  <div class="item-time">{{ formatTime(item.createdAt) }}</div>
                </div>
              </div>
              <div v-if="!notificationStore.loading && readNotifications.length === 0" class="empty-state">
                <el-empty description="暂无已读消息" :image-size="80" />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Bell, Check, CircleCheck, Close, Document, Money } from '@element-plus/icons-vue';
import { useNotificationStore } from '@/stores/notification';
import { ElMessage } from 'element-plus';
import { NotificationType, type Notification } from '@/types';

const router = useRouter();
const notificationStore = useNotificationStore();
const activeTab = ref('unread');

const unreadNotifications = computed(() =>
  notificationStore.notifications.filter(n => !n.isRead)
);

const readNotifications = computed(() =>
  notificationStore.notifications.filter(n => n.isRead)
);

function getTypeIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.BidAccepted:
      return Money;
    case NotificationType.ContractSigned:
      return Document;
    case NotificationType.ContractCompleted:
      return CircleCheck;
    case NotificationType.ContractTerminated:
      return Close;
    default:
      return Bell;
  }
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString('zh-CN');
}

async function handleVisibleChange(visible: boolean) {
  if (visible) {
    await notificationStore.fetchNotifications();
  }
}

async function handleClickItem(item: Notification) {
  if (!item.isRead) {
    await notificationStore.markAsRead(item.id);
  }
  const link = notificationStore.getNotificationLink(item);
  router.push(link);
}

async function handleMarkAllRead() {
  await notificationStore.markAllAsRead();
  ElMessage.success('已全部标记为已读');
}

onMounted(() => {
  notificationStore.fetchUnreadCount();
});

watch(
  () => notificationStore.unreadCount,
  (newVal) => {
    if (newVal > 0) {
      document.title = `(${newVal}) CyFreelance`;
    } else {
      document.title = 'CyFreelance';
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.notification-dropdown {
  cursor: pointer;
}

.bell-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.bell-wrapper:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.bell-icon {
  color: #fff;
}

.notification-badge :deep(.el-badge__content) {
  right: 2px;
  top: 2px;
}

.notification-menu {
  width: 380px;
  padding: 0;
  max-height: 520px;
  overflow: hidden;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.notification-tabs {
  --el-tabs-header-height: 40px;
}

.notification-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 16px;
}

.notification-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.notification-list {
  max-height: 380px;
  overflow-y: auto;
  padding: 4px 0;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.15s;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: var(--el-fill-color-light);
}

.notification-item.unread {
  background-color: var(--el-color-primary-light-9);
}

.notification-item.unread:hover {
  background-color: var(--el-color-primary-light-8);
}

.item-left {
  position: relative;
  flex-shrink: 0;
}

.dot {
  position: absolute;
  left: -4px;
  top: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--el-color-danger);
  z-index: 1;
}

.type-icon {
  width: 36px;
  height: 36px;
  padding: 8px;
  border-radius: 50%;
  background-color: var(--el-fill-color-light);
}

.type-icon.type-bid_accepted {
  color: var(--el-color-success);
  background-color: var(--el-color-success-light-9);
}

.type-icon.type-contract_signed {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.type-icon.type-contract_completed {
  color: var(--el-color-success);
  background-color: var(--el-color-success-light-9);
}

.type-icon.type-contract_terminated {
  color: var(--el-color-danger);
  background-color: var(--el-color-danger-light-9);
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  line-height: 1.4;
}

.item-desc {
  font-size: 13px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.empty-state {
  padding: 40px 0;
}
</style>
