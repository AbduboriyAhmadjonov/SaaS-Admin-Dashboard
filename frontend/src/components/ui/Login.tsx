import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with API authentication
    if (email && password) {
      onLogin(); // set auth state to true
      navigate('/');
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
        <span className="select-none text-m">
          <input type="checkbox" name="remember" id="remember" />
          <label className="p-2 mb-3" htmlFor="remember">
            Remember me
          </label>
        </span>
        <button
          type="submit"
          className="bg-blue-500 text-white mt-2 px-4 py-2 w-full rounded hover:bg-blue-600"
        >
          Login
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
