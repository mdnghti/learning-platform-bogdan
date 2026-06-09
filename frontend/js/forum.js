function getForumInitials(author) {
  return ((author?.firstName?.[0] || '') + (author?.lastName?.[0] || '')).toUpperCase() || '?';
}

async function loadTopics() {
  const container = document.getElementById('topicsContainer');
  if (!container) return;

  try {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('courseId');
    const topicId = params.get('topic');

    if (topicId) {
      loadTopicDetail(topicId);
      return;
    }

    if (!courseId) {
      const data = await api.get('/courses');

      if (!data.courses.length) {
        container.innerHTML = `
          <div class="empty-state">
            <h3>No courses available</h3>
            <p>Select a course to view its forum discussions.</p>
            <a href="/pages/courses.html" class="btn btn-primary mt-2">Browse Courses</a>
          </div>
        `;
        return;
      }

      container.innerHTML = '<h2 class="mb-2">Select a course forum</h2><div class="course-grid"></div>';
      const grid = container.querySelector('.course-grid');

      data.courses.forEach((course) => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.onclick = () => (window.location.href = `/pages/forum.html?courseId=${course._id}`);
        card.innerHTML = `
          <div class="course-card-thumb">💬</div>
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
      return;
    }

    const data = await api.get(`/forum/course/${courseId}`);

    if (!data.topics.length) {
      container.innerHTML = `
        <div class="flex-between mb-2">
          <h2>Discussions</h2>
          <button class="btn btn-sm btn-secondary" onclick="window.location.href='/pages/forum.html'">← All Courses</button>
        </div>
        <div class="empty-state">
          <h3>No discussions yet</h3>
          <p>Be the first to start a discussion!</p>
          <button class="btn btn-primary mt-2" onclick="openNewTopicModal()">Create Topic</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="flex-between mb-2">
        <h2>Discussions</h2>
        <div class="flex gap-1">
          <button class="btn btn-sm btn-secondary" onclick="window.location.href='/pages/forum.html'">← All Courses</button>
          <button class="btn btn-primary btn-sm" onclick="openNewTopicModal()">+ New Topic</button>
        </div>
      </div>
    `;

    data.topics.forEach((topic) => {
      const topicEl = document.createElement('div');
      topicEl.className = 'forum-topic';
      topicEl.innerHTML = `
        <div class="forum-topic-header">
          <div class="topic-author-avatar">${getForumInitials(topic.author)}</div>
          <div class="topic-content">
            <h3>
              <a href="/pages/forum.html?courseId=${courseId}&topic=${topic._id}">
                ${topic.isPinned ? '📌 ' : ''}${topic.title}
              </a>
            </h3>
            <p>${topic.content}</p>
            <div class="topic-meta">
              <span>${topic.author?.firstName || 'Unknown'} ${topic.author?.lastName || ''}</span>
              <span>${new Date(topic.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div class="topic-stats">
            <span>💬 ${topic.postCount || 0}</span>
            <span>👁 ${topic.views || 0}</span>
          </div>
        </div>
      `;
      container.appendChild(topicEl);
    });
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-error">Failed to load topics: ${error.message}</div>
    `;
  }
}

async function loadTopicDetail(topicId) {
  const container = document.getElementById('topicsContainer');

  try {
    const data = await api.get(`/forum/${topicId}`);
    const topic = data.topic;

    container.innerHTML = `
      <div class="topic-detail-header">
        <button class="btn btn-sm btn-ghost mb-2" onclick="window.location.href='/pages/forum.html?courseId=${topic.course}'">← Back to topics</button>
        <h1>${topic.isPinned ? '📌 ' : ''}${topic.title}</h1>
        <div class="flex gap-2 text-sm text-muted" style="flex-wrap:wrap">
          <span>👤 ${topic.author?.firstName || 'Unknown'} ${topic.author?.lastName || ''}</span>
          <span>📅 ${new Date(topic.createdAt).toLocaleDateString()}</span>
          <span>👁 ${topic.views} views</span>
        </div>
      </div>
      <div id="postsContainer"></div>
      <div class="new-post-form">
        <h3 class="mb-2">Reply</h3>
        <textarea class="form-control mb-2" id="replyContent" placeholder="Write your reply..." rows="3"></textarea>
        <button class="btn btn-primary btn-sm" onclick="submitReply('${topic._id}')">Post Reply</button>
      </div>
    `;

    const postsContainer = document.getElementById('postsContainer');
    const posts = data.posts || [];

    if (!posts.length) {
      postsContainer.innerHTML = '<div class="empty-state"><p>No replies yet. Be the first to reply!</p></div>';
    } else {
      postsContainer.innerHTML = posts
        .map(
          (post) => `
        <div class="forum-post">
          <div class="post-avatar">${getForumInitials(post.author)}</div>
          <div class="post-body">
            <div class="post-header">
              <span class="post-author">${post.author?.firstName || 'Unknown'} ${post.author?.lastName || ''}</span>
              <span class="post-date">${new Date(post.createdAt).toLocaleDateString()} ${post.isEdited ? '(edited)' : ''}</span>
            </div>
            <div class="post-content">${post.content}</div>
          </div>
        </div>
      `
        )
        .join('');
    }
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-error">Failed to load topic: ${error.message}</div>
    `;
  }
}

function openNewTopicModal() {
  const modal = document.getElementById('newTopicModal');
  if (modal) modal.classList.add('active');
}

function closeNewTopicModal() {
  const modal = document.getElementById('newTopicModal');
  if (modal) modal.classList.remove('active');
}

async function createTopic() {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('courseId');
  const title = document.getElementById('topicTitle')?.value;
  const content = document.getElementById('topicContent')?.value;

  if (!title || !content) {
    showAlert('Please fill in all fields', 'error');
    return;
  }

  try {
    await api.post('/forum/topics', { title, content, course: courseId });
    showAlert('Topic created!', 'success');
    closeNewTopicModal();
    loadTopics();
  } catch (error) {
    showAlert(error.message || 'Failed to create topic', 'error');
  }
}

async function submitReply(topicId) {
  const content = document.getElementById('replyContent')?.value;
  if (!content) {
    showAlert('Please write a reply', 'error');
    return;
  }

  try {
    await api.post('/forum/posts', { topic: topicId, content });
    showAlert('Reply posted!', 'success');
    document.getElementById('replyContent').value = '';
    loadTopicDetail(topicId);
  } catch (error) {
    showAlert(error.message || 'Failed to post reply', 'error');
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

document.addEventListener('DOMContentLoaded', loadTopics);
