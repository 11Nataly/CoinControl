import React, { useState } from 'react';
import { TrendingUp, Lock, Mail, User, DollarSign } from 'lucide-react';
import { register } from "../services/authService";

interface RegisterPageProps {
  onRegister: (email: string) => void;
  onSwitchToLogin: () => void;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'Dólar estadounidense' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'MXN', symbol: '$', name: 'Peso mexicano' },
  { code: 'ARS', symbol: '$', name: 'Peso argentino' },
  { code: 'COP', symbol: '$', name: 'Peso colombiano' },
  { code: 'CLP', symbol: '$', name: 'Peso chileno' },
];

export function RegisterPage({ onRegister, onSwitchToLogin }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState('COP');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const usuarioData = {
        nombre: name,
        email: email,
        password: password,
        confirm_password: confirmPassword,
        moneda_preferida: currency
      };

      const usuario = await register(usuarioData); // 🔥 ENVÍA AL BACKEND

      onRegister(usuario.email); // continúa flujo
    } catch (err: any) {
      setError(err.message);
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

        <h1 className="text-center text-emerald-800 mb-2">Crear Cuenta</h1>
        <p className="text-center text-gray-600 mb-8">
          Comienza a gestionar tus finanzas hoy
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 mb-2">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Juan Pérez"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {/* Moneda */}
          <div>
            <label className="block text-gray-700 mb-2">Moneda de operación</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 mb-2">Confirmar contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
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
            Crear Cuenta
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-emerald-600 hover:text-emerald-700"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
