// import { useRegister } from '@/hooks/useApi';
// import { useNavigate, Link } from 'react-router-dom';
// import { useState } from 'react';
// import {
//   UserIcon,
//   EnvelopeIcon,
//   LockClosedIcon,
//   EyeIcon,
//   EyeSlashIcon,
// } from '@heroicons/react/24/outline';

// export default function Register() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const registerMutation = useRegister();
//   const navigate = useNavigate();

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await registerMutation.mutateAsync({ name, email, password });
//       navigate('/login');
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
//       <form
//         onSubmit={handleRegister}
//         className="
//           bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl
//           w-full max-w-sm p-8 space-y-6
//           animate-[fadeInScale_0.5s_ease-out]
//         "
//       >
//         <h1 className="text-3xl font-bold text-center text-slate-800">Create Account</h1>

//         {/* Name */}
//         <label className="relative block">
//           <UserIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-slate-400 pointer-events-none" />
//           <input
//             type="text"
//             placeholder="Full Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
//             required
//           />
//         </label>

//         {/* Email */}
//         <label className="relative block">
//           <EnvelopeIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-slate-400 pointer-events-none" />
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
//             required
//           />
//         </label>

//         {/* Password */}
//         <label className="relative block">
//           <LockClosedIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-slate-400 pointer-events-none" />
//           <input
//             type={showPassword ? 'text' : 'password'}
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword((prev) => !prev)}
//             className="
//               absolute inset-y-0 right-0 flex items-center px-3
//               text-slate-400 hover:text-slate-600
//               transition-colors duration-150
//             "
//             aria-label={showPassword ? 'Hide password' : 'Show password'}
//           >
//             {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
//           </button>
//         </label>

//         {registerMutation.isError && (
//           <p className="text-sm text-red-600 text-center">
//             {(registerMutation.error as Error).message}
//           </p>
//         )}

//         <button
//           type="submit"
//           disabled={!name || !email || !password || registerMutation.isPending}
//           className="
//             w-full py-3 rounded-lg font-semibold text-white
//             bg-green-500 hover:bg-green-600
//             disabled:bg-slate-300 disabled:cursor-not-allowed
//             transition-all duration-150 active:scale-95
//           "
//         >
//           {registerMutation.isPending ? 'Creating...' : 'Create Account'}
//         </button>

//         <p className="text-sm text-center text-slate-600">
//           Already have an account?{' '}
//           <Link to="/login" className="font-semibold text-blue-500 hover:underline">
//             Log In
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }

import { useRegister } from '@/hooks/useApi';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sent, setSent] = useState(false);

  const registerMutation = useRegister();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync({ name, email, password });
      setSent(true);
      setTimeout(() => navigate('/login'), 4000);
    } catch {
      /* error handled below */
    }
  };

  if (sent)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-sm p-8 text-center animate-[fadeInScale_0.5s_ease-out]">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Almost there!</h2>
          <p className="text-slate-600">
            We sent a verification link to <span className="font-medium">{email}</span>.<br />
            Check your inbox (and spam folder) before logging in.
          </p>
        </div>
        <style>{`
          @keyframes fadeInScale {
            0%   { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleRegister}
        className="
          bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl
          w-full max-w-sm p-8 space-y-6
          animate-[fadeInScale_0.5s_ease-out]
        "
      >
        <h1 className="text-3xl font-bold text-center text-slate-800">Create Account</h1>

        <label className="relative block">
          <UserIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            required
          />
        </label>

        <label className="relative block">
          <EnvelopeIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            required
          />
        </label>

        <label className="relative block">
          <LockClosedIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
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

        {registerMutation.isError && (
          <p className="text-sm text-red-600 text-center">
            {(registerMutation.error as Error).message}
          </p>
        )}

        <button
          type="submit"
          disabled={!name || !email || !password || registerMutation.isPending}
          className="
            w-full py-3 rounded-lg font-semibold text-white
            bg-green-500 hover:bg-green-600
            disabled:bg-slate-300 disabled:cursor-not-allowed
            transition-all duration-150 active:scale-95
          "
        >
          {registerMutation.isPending ? 'Creating...' : 'Create Account'}
        </button>

        <p className="text-sm text-center text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-500 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
