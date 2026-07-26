/**
 * Cliente API - Conecta con el backend FastAPI
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o no válido
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== AUTENTICACIÓN =====
export const authAPI = {
  registro: (email, password, nombreEmpresa) =>
    api.post('/api/auth/registro', { email, password, nombre_empresa: nombreEmpresa }),
  
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),
  
  getMe: () =>
    api.get('/api/auth/me')
};

// ===== PROYECTOS =====
export const proyectosAPI = {
  listar: () =>
    api.get('/api/proyectos/'),
  
  crear: (nombre, cliente, descripcion) =>
    api.post('/api/proyectos/', { nombre, cliente, descripcion }),
  
  obtener: (proyectoId) =>
    api.get(`/api/proyectos/${proyectoId}`),
  
  actualizar: (proyectoId, data) =>
    api.put(`/api/proyectos/${proyectoId}`, data),
  
  eliminar: (proyectoId) =>
    api.delete(`/api/proyectos/${proyectoId}`)
};

// ===== ZONAS =====
export const zonasAPI = {
  listar: (proyectoId) =>
    api.get(`/api/proyectos/${proyectoId}/zonas`),
  
  crear: (proyectoId, nombre, descripcion) =>
    api.post(`/api/proyectos/${proyectoId}/zonas`, { nombre, descripcion }),
  
  actualizar: (zonaId, data) =>
    api.put(`/api/zonas/${zonaId}`, data),
  
  eliminar: (zonaId) =>
    api.delete(`/api/zonas/${zonaId}`)
};

// ===== TIPOS DE BOCA =====
export const tiposBocaAPI = {
  listar: (proyectoId) =>
    api.get(`/api/proyectos/${proyectoId}/tipos-boca`),
  
  crear: (proyectoId, nombre, descripcion) =>
    api.post(`/api/proyectos/${proyectoId}/tipos-boca`, { nombre, descripcion }),
  
  actualizar: (tipoId, data) =>
    api.put(`/api/tipos-boca/${tipoId}`, data),
  
  eliminar: (tipoId) =>
    api.delete(`/api/tipos-boca/${tipoId}`)
};

// ===== MATERIALES =====
export const materialesAPI = {
  listar: (proyectoId) =>
    api.get(`/api/proyectos/${proyectoId}/materiales`),
  
  crear: (nombre, unidad, categoria, precioUnitario, proveedor) =>
    api.post('/api/materiales', {
      nombre,
      unidad,
      categoria,
      precio_unitario: precioUnitario,
      proveedor
    }),
  
  actualizar: (materialId, data) =>
    api.put(`/api/materiales/${materialId}`, data),
  
  eliminar: (materialId) =>
    api.delete(`/api/materiales/${materialId}`)
};

// ===== RECETAS =====
export const recetasAPI = {
  listar: (tipoId) =>
    api.get(`/api/tipos-boca/${tipoId}/recetas`),
  
  crear: (tipoId, materialId, cantidad) =>
    api.post(`/api/tipos-boca/${tipoId}/recetas`, {
      tipo_boca_id: tipoId,
      material_id: materialId,
      cantidad
    }),
  
  actualizar: (recetaId, cantidad) =>
    api.put(`/api/recetas/${recetaId}`, { cantidad }),
  
  eliminar: (recetaId) =>
    api.delete(`/api/recetas/${recetaId}`)
};

// ===== CONTEO DE BOCAS =====
export const conteoBocasAPI = {
  listar: (proyectoId) =>
    api.get(`/api/proyectos/${proyectoId}/conteo-bocas`),
  
  crear: (proyectoId, zonaId, tipoId, cantidad) =>
    api.post(`/api/proyectos/${proyectoId}/conteo-bocas`, {
      zona_id: zonaId,
      tipo_boca_id: tipoId,
      cantidad
    }),
  
  actualizar: (conteoId, cantidad) =>
    api.put(`/api/conteo-bocas/${conteoId}`, { cantidad }),
};

// ===== CÓMPUTO =====
export const computoAPI = {
  calcular: (proyectoId) =>
    api.get(`/api/proyectos/${proyectoId}/computo`)
};

export default api;
