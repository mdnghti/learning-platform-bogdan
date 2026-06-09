async function loadGrades() {
  const container = document.getElementById('gradesContainer');
  if (!container) return;

  try {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    const data = await api.get('/grades/my');

    if (!data.grades.length) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No grades yet</h3>
          <p>Your grades will appear here once assignments are graded.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Type</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Grade</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${data.grades
              .map(
                (g) => `
              <tr>
                <td>${g.course?.title || 'N/A'}</td>
                <td><span class="badge badge-primary">${g.type}</span></td>
                <td>${g.score} / ${g.maxScore}</td>
                <td>${g.percentage}%</td>
                <td><span class="badge badge-${g.letterGrade === 'F' ? 'danger' : 'success'}">${g.letterGrade}</span></td>
                <td class="text-sm text-muted">${new Date(g.createdAt).toLocaleDateString()}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    loadStatistics();
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-error">Failed to load grades: ${error.message}</div>
    `;
  }
}

async function loadStatistics() {
  const statsContainer = document.getElementById('gradesStats');
  if (!statsContainer) return;

  try {
    const data = await api.get('/grades/statistics');
    const stats = data.statistics;

    statsContainer.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Average Score</div>
          <div class="stat-value">${stats.averagePercentage || 0}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Highest Score</div>
          <div class="stat-value">${stats.highestScore || 0}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Lowest Score</div>
          <div class="stat-value">${stats.lowestScore || 0}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Grades</div>
          <div class="stat-value">${stats.totalGrades}</div>
        </div>
      </div>
    `;
  } catch {
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadGrades();
});
