import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '@/hooks/useApi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginMutation.mutateAsync({ email, password });
      if (user) {
        navigate('/');
      }
    } catch (err) {
      {
        loginMutation.isError && (
          <p className="text-red-500 text-sm mt-2">{(loginMutation.error as Error).message}</p>
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 mb-3"
        />
        <button
          type="submit"
          disabled={!email && !password ? true : false}
          className={`bg-blue-500 text-white mt-2 px-4 py-2 w-full rounded ${
            !email || !password ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Create an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
