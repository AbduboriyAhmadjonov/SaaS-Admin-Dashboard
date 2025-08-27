import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '@/hooks/useApi';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    try {
      await loginMutation.mutateAsync({ email: email.trim(), password });
      navigate('/', { replace: true });
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    }
  };

  const isFormValid = email.trim() && password.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="
          bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl
          w-full max-w-sm p-8 space-y-6
          animate-[fadeInScale_0.5s_ease-out]
        "
      >
        <h1 className="text-3xl font-bold text-center text-slate-800">Welcome back</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Email */}
        <label className="relative block">
          <EnvelopeIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            disabled={loginMutation.isPending}
            required
          />
        </label>

        {/* Password with eye toggle */}
        <label className="relative block">
          <LockClosedIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            disabled={loginMutation.isPending}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </label>

        <button
          type="submit"
          disabled={!isFormValid || loginMutation.isPending}
          className="
            w-full py-3 rounded-lg font-semibold text-white
            bg-blue-500 hover:bg-blue-600
            disabled:bg-slate-300 disabled:cursor-not-allowed
            transition-all duration-150 active:scale-95
          "
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm text-center text-slate-600">
          Don’t have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>

      <style>{`
        @keyframes fadeInScale {
          0%   { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
