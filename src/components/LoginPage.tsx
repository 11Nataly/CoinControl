import React, { useState } from 'react';
import { TrendingUp, Lock, Mail } from 'lucide-react';
import { login } from "../services/authService"; 

interface LoginPageProps {
  onLogin: (email: string) => void;
  onSwitchToRegister: () => void;
}

export function LoginPage({ onLogin, onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      const user = await login(email, password);

      console.log("Usuario logueado:", user);
      
      onLogin(user.email);

    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-3 rounded-full">
            <TrendingUp className="w-12 h-12 text-emerald-600" />
          </div>
        </div>
        
        <h1 className="text-center text-emerald-800 mb-2">Control de Gastos</h1>
        <p className="text-center text-gray-600 mb-8">
          Inicia sesión para gestionar tus finanzas
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-gray-700 mb-2">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-emerald-600 hover:text-emerald-700"
            >
              Regístrate aquí
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}