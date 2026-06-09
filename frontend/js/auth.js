function requireAuth() {
  const token = api.getToken();
  if (!token) {
    window.location.href = '/pages/login.html';
    return null;
  }
  return token;
}

function redirectIfAuthenticated() {
  const token = api.getToken();
  if (token) {
    window.location.href = '/pages/index.html';
  }
}

async function loadUser() {
  try {
    const data = await api.get('/auth/me');
    return data.user;
  } catch {
    return null;
  }
}

function getInitials(user) {
  return ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase() || '?';
}

function renderUserMenu(user) {
  const userMenu = document.getElementById('userMenu');
  if (!userMenu) return;

  if (!user) {
    userMenu.innerHTML = `
      <a href="/pages/login.html" class="btn btn-primary btn-sm">Sign In</a>
    `;
    return;
  }

  userMenu.innerHTML = `
    <div class="user-menu" onclick="window.location.href='/pages/profile.html'">
      <div class="user-avatar">${getInitials(user)}</div>
      <div class="user-info">
        <div class="user-name">${user.firstName} ${user.lastName}</div>
        <div class="user-role">${user.role}</div>
      </div>
    </div>
  `;
}

function renderSidebar(user) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const roleLinks = {
    student: [
      { icon: '📊', label: 'Dashboard', href: '/pages/index.html' },
      { icon: '📚', label: 'Courses', href: '/pages/courses.html' },
      { icon: '📝', label: 'Assignments', href: '/pages/assignments.html' },
      { icon: '📋', label: 'Tests', href: '/pages/tests.html' },
      { icon: '⭐', label: 'Grades', href: '/pages/grades.html' },
      { icon: '💬', label: 'Forum', href: '/pages/forum.html' },
      { icon: '📅', label: 'Calendar', href: '/pages/calendar.html' },
      { icon: '🔔', label: 'Notifications', href: '/pages/notifications.html' },
    ],
    teacher: [
      { icon: '📊', label: 'Dashboard', href: '/pages/index.html' },
      { icon: '📚', label: 'My Courses', href: '/pages/courses.html' },
      { icon: '📝', label: 'Assignments', href: '/pages/assignments.html' },
      { icon: '📋', label: 'Tests', href: '/pages/tests.html' },
      { icon: '⭐', label: 'Grades', href: '/pages/grades.html' },
      { icon: '💬', label: 'Forum', href: '/pages/forum.html' },
      { icon: '📅', label: 'Calendar', href: '/pages/calendar.html' },
      { icon: '🔔', label: 'Notifications', href: '/pages/notifications.html' },
    ],
    admin: [
      { icon: '📊', label: 'Dashboard', href: '/pages/index.html' },
      { icon: '👥', label: 'Users', href: '/pages/admin.html' },
      { icon: '📚', label: 'Courses', href: '/pages/courses.html' },
      { icon: '💬', label: 'Forum', href: '/pages/forum.html' },
      { icon: '📅', label: 'Calendar', href: '/pages/calendar.html' },
    ],
  };

  const links = roleLinks[user?.role] || roleLinks.student;

  const currentPage = window.location.pathname.split('/').pop().split('?')[0];
  const navHtml = links
    .map(
      (link) => {
        const linkPage = link.href.split('/').pop().split('?')[0];
        const isActive = currentPage === linkPage ||
          (currentPage === 'course-details.html' && linkPage === 'courses.html') ||
          (currentPage === 'profile.html' && linkPage === 'index.html');
        return `
          <a href="${link.href}" class="${isActive ? 'active' : ''}">
            <span class="nav-icon">${link.icon}</span>
            ${link.label}
          </a>
        `;
      }
    )
    .join('');

  sidebar.innerHTML = `
    <div class="sidebar-brand">
      <span>LearnHub</span>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section">Main</div>
      ${navHtml}
    </nav>
    <div class="sidebar-footer">
      <a href="/pages/profile.html">⚙️ Settings</a>
      <a href="#" id="logoutBtn">🚪 Logout</a>
    </div>
  `;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      api.removeToken();
      window.location.href = '/pages/login.html';
    });
  }
}

async function initAuth() {
  const token = api.getToken();
  if (token) {
    const user = await loadUser();
    if (user) {
      renderUserMenu(user);
      renderSidebar(user);
      return user;
    }
  }
  renderUserMenu(null);
  renderSidebar(null);
  return null;
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', initAuth);
