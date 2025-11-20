import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login if on admin page
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// API Functions

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updatePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/password', { currentPassword, newPassword }),
};

// Home Page
export const homeAPI = {
  getHomePage: () => api.get('/home'),
  updateHero: (data: any) => api.put('/home/hero', data),
  addCard: (data: any) => api.post('/home/cards', data),
  updateCard: (cardId: string, data: any) => api.put(`/home/cards/${cardId}`, data),
  deleteCard: (cardId: string) => api.delete(`/home/cards/${cardId}`),
};

// About Page
export const aboutAPI = {
  getAboutPage: () => api.get('/about'),
  updateAboutPage: (data: any) => api.put('/about', data),
  addPrinciple: (data: any) => api.post('/about/principles', data),
  updatePrinciple: (principleId: string, data: any) =>
    api.put(`/about/principles/${principleId}`, data),
  deletePrinciple: (principleId: string) =>
    api.delete(`/about/principles/${principleId}`),
};

// Team
export const teamAPI = {
  getTeamMembers: () => api.get('/team'),
  getTeamMember: (id: string) => api.get(`/team/${id}`),
  createTeamMember: (data: any) => api.post('/team', data),
  updateTeamMember: (id: string, data: any) => api.put(`/team/${id}`, data),
  deleteTeamMember: (id: string) => api.delete(`/team/${id}`),
};

// Services
export const servicesAPI = {
  getServicesPage: () => api.get('/services/page'),
  updateServicesPage: (data: any) => api.put('/services/page', data),
  getServices: () => api.get('/services'),
  getAllServices: () => api.get('/services/all'),
  getService: (id: string) => api.get(`/services/${id}`),
  createService: (data: any) => api.post('/services', data),
  updateService: (id: string, data: any) => api.put(`/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/services/${id}`),
};

// Contact
export const contactAPI = {
  getContactInfo: () => api.get('/contact/info'),
  updateContactInfo: (data: any) => api.put('/contact/info', data),
  submitContact: (data: any) => api.post('/contact/submit', data),
  getSubmissions: (params?: any) => api.get('/contact/submissions', { params }),
  getSubmission: (id: string) => api.get(`/contact/submissions/${id}`),
  updateSubmission: (id: string, data: any) =>
    api.put(`/contact/submissions/${id}`, data),
  deleteSubmission: (id: string) => api.delete(`/contact/submissions/${id}`),
};

// Upload
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadMultiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
