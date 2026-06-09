let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

async function loadCalendar() {
  const container = document.getElementById('calendarContainer');
  if (!container) return;

  try {
    const startDate = new Date(currentYear, currentMonth, 1).toISOString();
    const endDate = new Date(currentYear, currentMonth + 1, 0).toISOString();

    const data = await api.get(`/calendar?startDate=${startDate}&endDate=${endDate}`);

    container.innerHTML = `
      <div class="card">
        <div class="flex-between mb-2">
          <button class="btn btn-sm btn-secondary" onclick="changeMonth(-1)">← Prev</button>
          <h2>${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <button class="btn btn-sm btn-secondary" onclick="changeMonth(1)">Next →</button>
        </div>
        <div class="calendar-grid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;">
          ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            .map((d) => `<div class="text-center text-xs font-weight-700 text-muted" style="padding:0.5rem 0.25rem;background:var(--gray-50);border-radius:var(--radius-sm)">${d}</div>`)
            .join('')}
          ${renderCalendarDays(data.events)}
        </div>
      </div>
      <div class="mt-3">
        <div class="flex-between mb-2">
          <h3>Events</h3>
          <button class="btn btn-primary btn-sm" onclick="openAddEventModal()">+ Add Event</button>
        </div>
        <div id="eventsList"></div>
      </div>
    `;

    renderEventsList(data.events);
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-error">Failed to load calendar: ${error.message}</div>
    `;
  }
}

function renderCalendarDays(events) {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push('<div></div>');
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = new Date(currentYear, currentMonth, day).toDateString();
    const dayEvents = events.filter(
      (e) => new Date(e.startDate).toDateString() === dateStr
    );
    const isToday =
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();

    days.push(`
      <div class="calendar-day ${isToday ? 'calendar-today' : ''}" style="border:1px solid ${isToday ? 'var(--primary)' : 'var(--gray-200)'};border-radius:var(--radius);padding:6px;min-height:75px;cursor:pointer;transition:all 0.15s;background:${isToday ? 'var(--primary-bg)' : 'var(--white)'}" onclick="showDayEvents('${dateStr}')" onmouseover="this.style.borderColor='var(--primary-light)'" onmouseout="this.style.borderColor='${isToday ? 'var(--primary)' : 'var(--gray-200)'}'">
        <div class="text-xs font-weight-700 ${isToday ? 'text-primary' : 'text-muted'}" style="margin-bottom:2px">${day}</div>
        ${dayEvents
          .slice(0, 2)
          .map(
            (e) =>
              `<div class="text-xs" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:1px 4px;border-radius:3px;background:${e.type === 'assignment_due' ? 'var(--danger-bg)' : 'var(--primary-bg)'};margin-top:2px;color:${e.type === 'assignment_due' ? 'var(--danger)' : 'var(--primary)'}">${e.type === 'assignment_due' ? '📝' : '📅'} ${e.title}</div>`
          )
          .join('')}
        ${dayEvents.length > 2 ? `<div class="text-xs text-muted" style="margin-top:2px">+${dayEvents.length - 2} more</div>` : ''}
      </div>
    `);
  }

  return days.join('');
}

function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  loadCalendar();
}

function renderEventsList(events) {
  const list = document.getElementById('eventsList');
  if (!list) return;

  const futureEvents = events.filter((e) => new Date(e.startDate) >= new Date()).slice(0, 10);

  if (!futureEvents.length) {
    list.innerHTML = '<div class="empty-state"><p>No upcoming events.</p></div>';
    return;
  }

  list.innerHTML = futureEvents
    .map(
      (e) => `
    <div class="card mb-2" style="padding:1rem">
      <div class="flex-between" style="gap:1rem">
        <div style="flex:1;min-width:0">
          <div class="flex gap-1" style="align-items:center;flex-wrap:wrap">
            <h4 class="text-sm font-weight-700">${e.title}</h4>
            <span class="badge badge-primary text-xs" style="text-transform:capitalize">${e.type.replace('_', ' ')}</span>
          </div>
          ${e.description ? `<p class="text-xs text-muted mt-1">${e.description}</p>` : ''}
          <span class="text-xs text-muted mt-1" style="display:inline-block">📅 ${new Date(e.startDate).toLocaleString()}</span>
        </div>
      </div>
    </div>
  `
    )
    .join('');
}

function showDayEvents(dateStr) {
  showAlert(`Events for ${new Date(dateStr).toLocaleDateString()}`, 'info');
}

function openAddEventModal() {
  const modal = document.getElementById('addEventModal');
  if (modal) modal.classList.add('active');
}

function closeAddEventModal() {
  const modal = document.getElementById('addEventModal');
  if (modal) modal.classList.remove('active');
}

async function addEvent() {
  const title = document.getElementById('eventTitle')?.value;
  const description = document.getElementById('eventDescription')?.value;
  const startDate = document.getElementById('eventStartDate')?.value;
  const endDate = document.getElementById('eventEndDate')?.value;
  const type = document.getElementById('eventType')?.value;

  if (!title || !startDate) {
    showAlert('Title and start date are required', 'error');
    return;
  }

  try {
    await api.post('/calendar', {
      title,
      description,
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      type,
    });
    showAlert('Event added!', 'success');
    closeAddEventModal();
    loadCalendar();
  } catch (error) {
    showAlert(error.message || 'Failed to add event', 'error');
  }
}

document.addEventListener('DOMContentLoaded', loadCalendar);
