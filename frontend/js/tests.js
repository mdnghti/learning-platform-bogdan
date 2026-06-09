let currentTestId = null;
let currentQuestions = [];

function getInitials(author) {
  return ((author?.firstName?.[0] || '') + (author?.lastName?.[0] || '')).toUpperCase() || '?';
}

async function loadTests() {
  const container = document.getElementById('testsContainer');
  if (!container) return;

  try {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('courseId');

    if (courseId) {
      const data = await api.get(`/tests/course/${courseId}`);

      if (!data.tests.length) {
        container.innerHTML = `
          <div class="empty-state">
            <h3>No tests available</h3>
            <p>There are no tests for this course yet.</p>
            <button class="btn btn-secondary btn-sm mt-2" onclick="window.location.href='/pages/courses.html'">Back to Courses</button>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="flex-between mb-2">
          <h2>Course Tests</h2>
          <button class="btn btn-sm btn-secondary" onclick="window.location.href='/pages/courses.html'">← All Courses</button>
        </div>
      `;

      data.tests.forEach((t) => {
        const div = document.createElement('div');
        div.className = 'card mb-2';
        div.innerHTML = `
          <div class="flex-between" style="gap:1rem">
            <div>
              <h3 class="mb-1">${t.title}</h3>
              <p class="text-sm text-muted mb-1">${t.description || 'No description'}</p>
              <div class="flex gap-2 text-xs text-muted" style="flex-wrap:wrap">
                <span>⏱ ${t.timeLimit ? `${t.timeLimit} min` : 'No limit'}</span>
                <span>📝 ${t.questions?.length || 0} questions</span>
                <span>🎯 Pass: ${t.passingScore}%</span>
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="startTest('${t._id}')">Start Test</button>
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
            <p>Enroll in a course to access tests.</p>
            <a href="/pages/courses.html" class="btn btn-primary mt-2">Browse Courses</a>
          </div>
        `;
        return;
      }

      container.innerHTML = '<h2 class="mb-2">Select a course to view tests</h2><div class="course-grid"></div>';
      const grid = container.querySelector('.course-grid');

      data.courses.forEach((course) => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.onclick = () => (window.location.href = `/pages/tests.html?courseId=${course._id}`);
        card.innerHTML = `
          <div class="course-card-thumb">📋</div>
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
      <div class="alert alert-error">Failed to load tests: ${error.message}</div>
    `;
  }
}

async function startTest(testId) {
  try {
    const data = await api.get(`/tests/${testId}`);
    const test = data.test;

    currentTestId = test._id;
    currentQuestions = test.questions || [];

    const container = document.getElementById('testsContainer');
    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2>${test.title}</h2>
          <button class="btn btn-danger btn-sm" onclick="cancelTest()">Cancel</button>
        </div>
        ${test.description ? `<p class="text-sm text-muted mb-2">${test.description}</p>` : ''}
        <form id="testForm">
          <div id="questionsContainer"></div>
          <button type="submit" class="btn btn-primary mt-3">Submit Answers</button>
        </form>
        <div id="testResult" class="mt-3"></div>
      </div>
    `;

    const questionsContainer = document.getElementById('questionsContainer');
    questionsContainer.innerHTML = currentQuestions
      .map(
        (q, i) => `
      <div class="mb-3" style="padding:1rem;background:var(--gray-50);border-radius:var(--radius)">
        <p class="font-weight-600 mb-1" style="font-size:0.9375rem">${i + 1}. ${q.text} <span class="text-muted text-xs font-weight-600">(${q.points} pts)</span></p>
        ${renderQuestionInput(q, i)}
      </div>
    `
      )
      .join('');

    document.getElementById('testForm').addEventListener('submit', submitTestAnswers);
  } catch (error) {
    showAlert('Failed to load test: ' + error.message, 'error');
  }
}

function renderQuestionInput(question, index) {
  switch (question.type) {
    case 'multiple_choice':
      return question.options
        .map(
          (opt, oi) => `
        <label class="flex gap-1 mb-1" style="cursor:pointer;align-items:center">
          <input type="checkbox" name="q_${question._id}" value="${opt.value}" style="width:16px;height:16px">
          <span class="text-sm">${opt.label}</span>
        </label>
      `
        )
        .join('');

    case 'single_choice':
      return question.options
        .map(
          (opt) => `
        <label class="flex gap-1 mb-1" style="cursor:pointer;align-items:center">
          <input type="radio" name="q_${question._id}" value="${opt.value}" style="width:16px;height:16px">
          <span class="text-sm">${opt.label}</span>
        </label>
      `
        )
        .join('');

    case 'true_false':
      return `
        <label class="flex gap-1 mb-1" style="cursor:pointer;align-items:center">
          <input type="radio" name="q_${question._id}" value="true" style="width:16px;height:16px">
          <span class="text-sm">True</span>
        </label>
        <label class="flex gap-1 mb-1" style="cursor:pointer;align-items:center">
          <input type="radio" name="q_${question._id}" value="false" style="width:16px;height:16px">
          <span class="text-sm">False</span>
        </label>
      `;

    case 'short_answer':
      return `
        <input type="text" class="form-control" name="q_${question._id}" placeholder="Your answer...">
      `;

    default:
      return '<p>Unsupported question type</p>';
  }
}

async function submitTestAnswers(e) {
  e.preventDefault();

  const answers = {};
  for (const question of currentQuestions) {
    const inputs = document.querySelectorAll(`[name="q_${question._id}"]`);
    if (question.type === 'multiple_choice') {
      const checked = [];
      inputs.forEach((inp) => {
        if (inp.checked) checked.push(inp.value);
      });
      answers[question._id] = checked;
    } else if (question.type === 'single_choice' || question.type === 'true_false') {
      inputs.forEach((inp) => {
        if (inp.checked) answers[question._id] = inp.value;
      });
    } else {
      answers[question._id] = inputs[0]?.value || '';
    }
  }

  try {
    const data = await api.post(`/tests/${currentTestId}/submit`, { answers });
    const result = data.result;

    const passedColor = result.passed ? 'var(--success)' : 'var(--danger)';
    const passedBg = result.passed ? 'var(--success-bg)' : 'var(--danger-bg)';
    const resultDiv = document.getElementById('testResult');
    resultDiv.innerHTML = `
      <div style="background:${passedBg};border:2px solid ${passedColor};border-radius:var(--radius-lg);padding:1.5rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:0.5rem">${result.passed ? '🎉' : '😔'}</div>
        <h3 style="color:${passedColor};font-weight:800;font-size:1.25rem;margin-bottom:0.5rem">${result.passed ? 'Test Passed!' : 'Test Failed'}</h3>
        <div style="font-size:2rem;font-weight:800;color:var(--gray-900);margin-bottom:0.25rem">${result.percentage}%</div>
        <p style="color:var(--gray-500)">${result.earnedPoints} / ${result.totalPoints} points</p>
        <p style="color:var(--gray-500);font-size:0.875rem">Passing score: ${data.passingScore}%</p>
      </div>
    `;

    document.querySelector('#testForm button[type="submit"]').disabled = true;
  } catch (error) {
    showAlert('Failed to submit test: ' + error.message, 'error');
  }
}

function cancelTest() {
  currentTestId = null;
  currentQuestions = [];
  loadTests();
}

function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  const target = document.querySelector('.content-area') || document.body;
  target.prepend(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', loadTests);
