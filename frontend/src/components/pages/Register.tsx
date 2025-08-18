import { useRegister } from '@/hooks/useApi';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerMutation = useRegister();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync({ name, email, password });
      alert('Registered successfully');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-semibold mb-4">Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 mb-3"
        />
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
          disabled={!name || !email || !password}
          className={`bg-green-500 text-white mt-2 px-4 py-2 w-full rounded ${
            !name || !email || !password ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
          }`}
        >
          {registerMutation.isPending ? 'Creating...' : 'Create Account'}
        </button>

        {registerMutation.isError && (
          <p className="text-red-500 mt-2">{(registerMutation.error as Error).message}</p>
        )}

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
