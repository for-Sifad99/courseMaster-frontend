import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'https://backend-ecru-three-41.vercel.app/api',
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const registerStudent = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const loginAdmin = (data) => api.post('/auth/admin/login', data);

// Course API
export const getCourses = (params) => api.get('/courses', { params });
export const getCourseById = (id) => api.get(`/courses/${id}`);
export const getEnrolledCourses = () => api.get('/courses/me/enrolled');
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
export const enrollInCourse = (id, batchId) => {
  const data = batchId ? { batchId } : {};
  return api.post(`/courses/${id}/enroll`, data);
};
export const markLectureCompleted = (courseId, lectureId) => api.put(`/courses/${courseId}/lectures/${lectureId}/complete`);
export const submitAssignment = (courseId, moduleId, data) => api.post(`/courses/${courseId}/modules/${moduleId}/assignment`, data);
export const submitQuiz = (courseId, moduleId, data) => api.post(`/courses/${courseId}/modules/${moduleId}/quiz`, data);
export const getEnrolledStudents = (courseId) => api.get(`/courses/${courseId}/students`);
export const getSubmittedAssignments = (courseId) => api.get(`/courses/${courseId}/assignments`);
export const getSubmittedQuizzes = (courseId) => api.get(`/courses/${courseId}/quizzes`);
export const getCourseBatches = (courseId) => api.get(`/courses/${courseId}/batches`);

export default api;