/**
 * Componente Login
 * Login y registro de usuarios
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import './Login.css';

export default function Login() {
  const [mode, setMode] = useState('login'); // login | registro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('access_token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.registro(email, password, nombreEmpresa);
      // Auto-login después del registro
      const loginResponse = await authAPI.login(email, password);
      localStorage.setItem('access_token', loginResponse.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>⚡ Cotizador de Obras Eléctricas</h1>

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <h2>Iniciar Sesión</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>

            <p className="mode-switch">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('registro')}
                className="link-button"
              >
                Registrate aquí
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegistro}>
            <h2>Crear Cuenta</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Nombre de Empresa:</label>
              <input
                type="text"
                value={nombreEmpresa}
                onChange={(e) => setNombreEmpresa(e.target.value)}
                required
                placeholder="APEXCORE S.A.S."
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>

            <p className="mode-switch">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="link-button"
              >
                Inicia sesión aquí
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
