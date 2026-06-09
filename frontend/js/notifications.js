async function loadNotifications() {
  const container = document.getElementById('notificationsContainer');
  if (!container) return;

  try {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    const data = await api.get('/notifications');

    if (!data.notifications.length) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="flex-between mb-2">
        <h2>All Notifications</h2>
        <button class="btn btn-sm btn-secondary" onclick="markAllAsRead()">Mark All as Read</button>
      </div>
    `;

    data.notifications.forEach((notif) => {
      const el = document.createElement('div');
      el.className = `card mb-1 ${!notif.isRead ? 'border-left-primary' : ''}`;
      el.style.cssText = `cursor:pointer;${!notif.isRead ? 'border-left: 3px solid var(--primary);' : ''}`;
      el.onclick = () => markAsRead(notif._id);

      el.innerHTML = `
        <div class="flex-between">
          <div>
            <h4 class="text-sm font-weight-600">${notif.title}</h4>
            <p class="text-sm text-muted">${notif.message}</p>
            <span class="text-xs text-muted">${new Date(notif.createdAt).toLocaleDateString()}</span>
          </div>
          ${!notif.isRead ? '<span class="badge badge-primary">New</span>' : ''}
        </div>
      `;

      container.appendChild(el);
    });
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-error">Failed to load notifications: ${error.message}</div>
    `;
  }
}

async function loadUnreadCount() {
  const badge = document.getElementById('notificationBadge');
  if (!badge) return;

  try {
    const data = await api.get('/notifications/unread-count');
    if (data.count > 0) {
      badge.textContent = data.count > 99 ? '99+' : data.count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  } catch {
  }
}

async function markAsRead(id) {
  try {
    await api.put(`/notifications/${id}/read`);
    loadNotifications();
    loadUnreadCount();
  } catch {
  }
}

async function markAllAsRead() {
  try {
    await api.put('/notifications/read-all');
    loadNotifications();
    loadUnreadCount();
    showAlert('All notifications marked as read', 'success');
  } catch {
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadNotifications();
  loadUnreadCount();
});
