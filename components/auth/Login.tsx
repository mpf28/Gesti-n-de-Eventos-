import React, { useState, useContext } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { AppContext } from '../../App';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const { login, currentUser } = useContext(AppContext);
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = login(email, password);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado');
      }
    }
  };

  const setTestUser = () => {
      setEmail('user@example.com');
      setPassword('user');
  };

  const setTestAdmin = () => {
      setEmail('admin@example.com');
      setPassword('admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all hover:scale-105 duration-500">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestor de Eventos Pro</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Inicia sesión para continuar</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
         <div className="text-sm text-center">
            <span className="text-gray-500 dark:text-gray-400">¿No tienes cuenta? </span>
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Regístrate
            </Link>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Cuentas de prueba:</p>
            <button onClick={setTestAdmin} className="font-medium text-blue-600 hover:text-blue-500">Admin</button> | <button onClick={setTestUser} className="font-medium text-blue-600 hover:text-blue-500">Usuario</button>
        </div>
      </div>
    </div>
  );
};
