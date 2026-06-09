async function loadCourses() {
  const container = document.getElementById('coursesContainer');
  if (!container) return;

  try {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    const user = await loadUser();
    const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') || '';
    const difficulty = params.get('difficulty') || '';
    const view = params.get('view');

    let endpoint = isTeacher && view === 'my' ? '/courses/my' : '/courses';
    const queryParams = [];
    if (category) queryParams.push(`category=${category}`);
    if (difficulty) queryParams.push(`difficulty=${difficulty}`);
    if (queryParams.length && !isTeacher) endpoint += '?' + queryParams.join('&');

    const data = await api.get(endpoint);
    const courses = data.courses || [];

    if (isTeacher && !courses.length && view === 'my') {
      container.innerHTML = `
        <div class="empty-state">
          <h3>You haven't created any courses yet</h3>
          <p>Create your first course to get started.</p>
          <button class="btn btn-primary mt-2" onclick="openCreateCourseModal()">+ Create Course</button>
        </div>
      `;
      return;
    }

    if (!courses.length) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No courses found</h3>
          <p>There are no courses available yet.${isTeacher ? ' Create one!' : ''}</p>
          ${isTeacher ? '<button class="btn btn-primary mt-2" onclick="openCreateCourseModal()">+ Create Course</button>' : ''}
        </div>
      `;
      return;
    }

    container.innerHTML = '<div class="course-grid"></div>';
    const grid = container.querySelector('.course-grid');

    courses.forEach((course) => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.onclick = () => (window.location.href = `/pages/course-details.html?id=${course._id}`);

      card.innerHTML = `
        <div class="course-card-thumb">📚</div>
        <div class="course-card-body">
          <h3>${course.title}</h3>
          <p>${course.description}</p>
          <div class="course-card-meta">
            <span>${course.teacher?.firstName || 'Unknown'} ${course.teacher?.lastName || ''}</span>
            <span class="badge badge-${course.difficulty === 'beginner' ? 'success' : course.difficulty === 'intermediate' ? 'warning' : 'danger'}">${course.difficulty || 'beginner'}</span>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-error">Failed to load courses: ${error.message}</div>
    `;
  }
}

async function loadCourseDetails() {
  const container = document.getElementById('courseDetail');
  if (!container) return;

  try {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('id');

    if (!courseId) {
      container.innerHTML = '<div class="alert alert-error">Course ID is required</div>';
      return;
    }

    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    const data = await api.get(`/courses/${courseId}`);
    const course = data.course;
    const user = await loadUser();
    const isOwner = user?._id === course.teacher?._id;
    const canEdit = isOwner || user?.role === 'admin';

    container.innerHTML = `
      <div class="course-detail-header">
        <h1>${course.title}</h1>
        <div class="meta">
          <span>👨‍🏫 ${course.teacher?.firstName || 'Unknown'} ${course.teacher?.lastName || ''}</span>
          <span>📂 ${course.category || 'General'}</span>
          <span class="badge badge-${course.difficulty === 'beginner' ? 'success' : course.difficulty === 'intermediate' ? 'warning' : 'danger'}">${course.difficulty || 'beginner'}</span>
          <span>👥 ${course.students?.length || 0} students</span>
        </div>
      </div>
      <p class="mb-3">${course.description}</p>

      <div class="flex-between mb-2" style="flex-wrap:wrap;gap:0.5rem">
        <h2>Course Modules</h2>
        <div class="flex gap-1" style="flex-wrap:wrap">
          ${canEdit ? `
            <button class="btn btn-primary btn-sm" onclick="openCreateModuleModal('${course._id}')">+ Add Module</button>
            <button class="btn btn-secondary btn-sm" onclick="openCreateAssignmentModal('${course._id}')">+ Add Assignment</button>
            <button class="btn btn-secondary btn-sm" onclick="openCreateTestModal('${course._id}')">+ Add Test</button>
          ` : `
            <button class="btn btn-primary btn-sm" onclick="enrollCourse('${course._id}')">📝 Enroll</button>
          `}
        </div>
      </div>

      <div class="module-list" id="moduleList">
        ${course.modules?.length
          ? course.modules
              .map(
                (mod, i) => `
            <div class="module-item">
              <div class="module-header" onclick="toggleModule(${i})">
                <h3>📖 ${mod.title}</h3>
                <span class="arrow">▼</span>
              </div>
              <div class="module-content" id="moduleContent${i}">
                ${(mod.materials || []).length
                  ? mod.materials
                      .map(
                        (mat) => `
                    <div class="material-item">
                      <div class="material-icon ${mat.type}">${mat.type === 'video' ? '🎬' : mat.type === 'document' ? '📄' : mat.type === 'presentation' ? '📊' : '🔗'}</div>
                      <div class="material-info">
                        <h4>${mat.title}</h4>
                        <span>${mat.type}</span>
                      </div>
                    </div>
                  `
                      )
                      .join('')
                  : '<div class="text-sm text-muted" style="padding:0.5rem 0">No materials yet</div>'}
                ${canEdit ? `<button class="btn btn-sm btn-ghost mt-1" onclick="openAddMaterialModal('${mod._id}', '${course._id}')">+ Add Material</button>` : ''}
              </div>
            </div>
          `
              )
              .join('')
          : '<div class="empty-state"><h3>No modules yet</h3></div>'}
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-error">Failed to load course: ${error.message}</div>
    `;
  }
}

function toggleModule(index) {
  const content = document.getElementById(`moduleContent${index}`);
  const arrow = content?.previousElementSibling?.querySelector('.arrow');
  if (content) {
    content.classList.toggle('open');
    if (arrow) arrow.classList.toggle('open');
  }
}

async function enrollCourse(courseId) {
  try {
    await api.post('/users/enroll', { courseId });
    showAlert('Successfully enrolled!', 'success');
  } catch (error) {
    showAlert(error.message || 'Failed to enroll', 'error');
  }
}

function openCreateCourseModal() {
  const modal = document.getElementById('createCourseModal');
  if (modal) modal.classList.add('active');
}

function closeCreateCourseModal() {
  const modal = document.getElementById('createCourseModal');
  if (modal) modal.classList.remove('active');
}

async function createCourse() {
  const title = document.getElementById('courseTitle')?.value;
  const description = document.getElementById('courseDescription')?.value;
  const category = document.getElementById('courseCategory')?.value;
  const difficulty = document.getElementById('courseDifficulty')?.value;

  if (!title || !description) {
    showAlert('Title and description are required', 'error');
    return;
  }

  try {
    await api.post('/courses', { title, description, category, difficulty, isPublished: true });
    showAlert('Course created!', 'success');
    closeCreateCourseModal();
    loadCourses();
  } catch (error) {
    showAlert(error.message || 'Failed to create course', 'error');
  }
}

function openCreateModuleModal(courseId) {
  document.getElementById('moduleCourseId').value = courseId;
  const modal = document.getElementById('createModuleModal');
  if (modal) modal.classList.add('active');
}

function closeCreateModuleModal() {
  const modal = document.getElementById('createModuleModal');
  if (modal) modal.classList.remove('active');
}

async function createModule() {
  const courseId = document.getElementById('moduleCourseId').value;
  const title = document.getElementById('moduleTitle')?.value;

  if (!title) {
    showAlert('Module title is required', 'error');
    return;
  }

  try {
    await api.post(`/courses/${courseId}/modules`, { title });
    showAlert('Module created!', 'success');
    closeCreateModuleModal();
    loadCourseDetails();
  } catch (error) {
    showAlert(error.message || 'Failed to create module', 'error');
  }
}

function openAddMaterialModal(moduleId, courseId) {
  document.getElementById('materialModuleId').value = moduleId;
  document.getElementById('materialCourseId').value = courseId;
  const modal = document.getElementById('addMaterialModal');
  if (modal) modal.classList.add('active');
}

function closeAddMaterialModal() {
  const modal = document.getElementById('addMaterialModal');
  if (modal) modal.classList.remove('active');
}

async function addMaterial() {
  const moduleId = document.getElementById('materialModuleId').value;
  const title = document.getElementById('materialTitle')?.value;
  const type = document.getElementById('materialType')?.value;
  const content = document.getElementById('materialContent')?.value;

  if (!title || !content) {
    showAlert('Title and content are required', 'error');
    return;
  }

  try {
    await api.post(`/materials/module/${moduleId}`, { title, type, content });
    showAlert('Material added!', 'success');
    closeAddMaterialModal();
    loadCourseDetails();
  } catch (error) {
    showAlert(error.message || 'Failed to add material', 'error');
  }
}

function openCreateAssignmentModal(courseId) {
  document.getElementById('assignmentCourseId').value = courseId;
  const modal = document.getElementById('createAssignmentModal');
  if (modal) modal.classList.add('active');
}

function closeCreateAssignmentModal() {
  const modal = document.getElementById('createAssignmentModal');
  if (modal) modal.classList.remove('active');
}

async function createAssignment() {
  const courseId = document.getElementById('assignmentCourseId').value;
  const title = document.getElementById('assignmentTitle')?.value;
  const description = document.getElementById('assignmentDescription')?.value;
  const maxScore = document.getElementById('assignmentMaxScore')?.value || 100;
  const dueDate = document.getElementById('assignmentDueDate')?.value;

  if (!title || !description) {
    showAlert('Title and description are required', 'error');
    return;
  }

  try {
    await api.post('/assignments', {
      title, description, course: courseId, maxScore: Number(maxScore),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      isPublished: true,
    });
    showAlert('Assignment created!', 'success');
    closeCreateAssignmentModal();
  } catch (error) {
    showAlert(error.message || 'Failed to create assignment', 'error');
  }
}

function openCreateTestModal(courseId) {
  document.getElementById('testCourseId').value = courseId;
  const modal = document.getElementById('createTestModal');
  if (modal) modal.classList.add('active');
}

function closeCreateTestModal() {
  const modal = document.getElementById('createTestModal');
  if (modal) modal.classList.remove('active');
}

async function createTest() {
  const courseId = document.getElementById('testCourseId').value;
  const title = document.getElementById('testTitle')?.value;
  const description = document.getElementById('testDescription')?.value;
  const passingScore = document.getElementById('testPassingScore')?.value || 60;

  if (!title) {
    showAlert('Test title is required', 'error');
    return;
  }

  try {
    const data = await api.post('/tests', {
      title, description, course: courseId,
      passingScore: Number(passingScore),
      isPublished: true,
    });
    showAlert('Test created! You can now add questions.', 'success');
    closeCreateTestModal();
    window.location.href = `/pages/tests.html?courseId=${courseId}`;
  } catch (error) {
    showAlert(error.message || 'Failed to create test', 'error');
  }
}

async function loadFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const difficultyFilter = document.getElementById('difficultyFilter');
  if (!categoryFilter || !difficultyFilter) return;

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (categoryFilter.value) params.set('category', categoryFilter.value);
    if (difficultyFilter.value) params.set('difficulty', difficultyFilter.value);
    const query = params.toString();
    window.location.search = query ? `?${query}` : '';
  };

  categoryFilter.addEventListener('change', applyFilters);
  difficultyFilter.addEventListener('change', applyFilters);
}

function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  const target = document.querySelector('.content-area') || document.body;
  target.prepend(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  loadCourses();
  loadCourseDetails();
  loadFilters();
});
