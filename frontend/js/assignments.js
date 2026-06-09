async function loadAssignments() {
  const container = document.getElementById('assignmentsContainer');
  if (!container) return;

  try {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('courseId');

    if (courseId) {
      const data = await api.get(`/assignments/course/${courseId}`);

      if (!data.assignments.length) {
        container.innerHTML = `
          <div class="empty-state">
            <h3>No assignments yet</h3>
            <p>There are no assignments for this course.</p>
            <button class="btn btn-secondary btn-sm mt-2" onclick="window.location.href='/pages/courses.html'">Back to Courses</button>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="flex-between mb-2">
          <h2>Course Assignments</h2>
          <button class="btn btn-sm btn-secondary" onclick="window.location.href='/pages/courses.html'">← All Courses</button>
        </div>
      `;

      data.assignments.forEach((a) => {
        const div = document.createElement('div');
        div.className = 'card mb-2';
        div.innerHTML = `
          <div class="flex-between" style="gap:1rem">
            <div style="flex:1">
              <h3 class="mb-1">${a.title}</h3>
              <p class="text-sm text-muted mb-1">${a.description}</p>
              <div class="flex gap-2 text-xs text-muted" style="flex-wrap:wrap">
                <span>Max score: <strong>${a.maxScore}</strong></span>
                ${a.dueDate ? `<span>Due: <strong>${new Date(a.dueDate).toLocaleDateString()}</strong></span>` : ''}
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="openSubmitModal('${a._id}', '${a.title.replace(/'/g, "\\'")}')">Submit</button>
          </div>
        `;
        container.appendChild(div);
      });
    } else {
      const data = await api.get('/courses');

      if (!data.courses.length) {
        container.innerHTML = `
          <div class="empty-state">
            <h3>No courses available</h3>
            <p>Enroll in a course to see assignments.</p>
            <a href="/pages/courses.html" class="btn btn-primary mt-2">Browse Courses</a>
          </div>
        `;
        return;
      }

      container.innerHTML = '<h2 class="mb-2">Select a course to view assignments</h2><div class="course-grid"></div>';
      const grid = container.querySelector('.course-grid');

      data.courses.forEach((course) => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.onclick = () => (window.location.href = `/pages/assignments.html?courseId=${course._id}`);
        card.innerHTML = `
          <div class="course-card-thumb">📝</div>
          <div class="course-card-body">
            <h3>${course.title}</h3>
            <p>${course.description?.substring(0, 100) || ''}</p>
            <div class="course-card-meta">
              <span>${course.teacher?.firstName || ''} ${course.teacher?.lastName || ''}</span>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
    }
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-error">Failed to load assignments: ${error.message}</div>
    `;
  }
}

function openSubmitModal(assignmentId, title) {
  const modal = document.getElementById('submitModal');
  if (!modal) return;

  document.getElementById('submitAssignmentId').value = assignmentId;
  document.getElementById('submitModalTitle').textContent = `Submit: ${title}`;
  modal.classList.add('active');
}

function closeSubmitModal() {
  const modal = document.getElementById('submitModal');
  if (modal) modal.classList.remove('active');
}

async function submitAssignment() {
  const assignmentId = document.getElementById('submitAssignmentId').value;
  const content = document.getElementById('submitContent').value;
  const fileInput = document.getElementById('submitFile');
  const formData = new FormData();

  formData.append('assignmentId', assignmentId);
  if (content) formData.append('content', content);
  if (fileInput.files[0]) formData.append('file', fileInput.files[0]);

  try {
    await api.request('/assignments/submit', {
      method: 'POST',
      body: formData,
    });
    showAlert('Assignment submitted successfully!', 'success');
    closeSubmitModal();
  } catch (error) {
    showAlert(error.message || 'Failed to submit', 'error');
  }
}

function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  const target = document.querySelector('.content-area') || document.body;
  target.prepend(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', loadAssignments);
