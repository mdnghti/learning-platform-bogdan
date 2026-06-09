import apiClient from './api-client'

export const authApi = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (data) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),
}

export const userApi = {
  getProfile: (id) => apiClient.get(`/users/profile/${id}`),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  updatePassword: (data) => apiClient.put('/users/password', data),
  enroll: (courseId) => apiClient.post('/users/enroll', { courseId }),
}

export const courseApi = {
  getAll: () => apiClient.get('/courses'),
  getById: (id) => apiClient.get(`/courses/${id}`),
  create: (data) => apiClient.post('/courses', data),
  update: (id, data) => apiClient.put(`/courses/${id}`, data),
  delete: (id) => apiClient.delete(`/courses/${id}`),
}

export const materialApi = {
  getByModule: (moduleId) => apiClient.get(`/materials/module/${moduleId}`),
  getById: (id) => apiClient.get(`/materials/${id}`),
  create: (moduleId, data) => apiClient.post(`/materials/module/${moduleId}`, data),
  update: (id, data) => apiClient.put(`/materials/${id}`, data),
  delete: (id) => apiClient.delete(`/materials/${id}`),
}

export const testApi = {
  getByCourse: (courseId) => apiClient.get(`/tests/course/${courseId}`),
  getById: (id) => apiClient.get(`/tests/${id}`),
  create: (data) => apiClient.post('/tests', data),
  update: (id, data) => apiClient.put(`/tests/${id}`, data),
  delete: (id) => apiClient.delete(`/tests/${id}`),
  submit: (testId, answers) => apiClient.post(`/tests/${testId}/submit`, { answers }),
}

export const notificationApi = {
  getMine: () => apiClient.get('/notifications'),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  markRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllRead: () => apiClient.put('/notifications/read-all'),
  delete: (id) => apiClient.delete(`/notifications/${id}`),
}

export const adminApi = {
  getUsers: () => apiClient.get('/admin/users'),
  getUser: (id) => apiClient.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => apiClient.put(`/admin/users/${id}/role`, { role }),
  toggleUserStatus: (id) => apiClient.put(`/admin/users/${id}/toggle-status`),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
  getCourses: () => apiClient.get('/admin/courses'),
  getStatistics: () => apiClient.get('/admin/statistics'),
}
