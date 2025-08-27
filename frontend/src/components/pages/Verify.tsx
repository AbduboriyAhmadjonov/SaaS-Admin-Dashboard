import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

export default function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'invalid'>('verifying');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('invalid');
      return;
    }

    fetch(`http://localhost:8000/api/auth/verify?token=${token}`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
          setEmail(data.email || '');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [searchParams]);

  const getStatusContent = () => {
    switch (status) {
      case 'verifying':
        return {
          Icon: ArrowPathIcon,
          title: 'Verifying your email',
          subtitle: 'Please wait while we confirm your email address…',
          color: 'text-blue-500',
          iconSpin: true,
        };
      case 'success':
        return {
          Icon: CheckCircleIcon,
          title: 'Email verified!',
          subtitle: `Your email ${email} has been successfully verified.`,
          color: 'text-green-500',
        };
      case 'error':
        return {
          Icon: XCircleIcon,
          title: 'Verification failed',
          subtitle: 'The verification link has expired or is invalid.',
          color: 'text-red-500',
        };
      case 'invalid':
        return {
          Icon: XCircleIcon,
          title: 'Invalid link',
          subtitle: 'This verification link appears to be malformed.',
          color: 'text-orange-500',
        };
    }
  };

  const { Icon, title, subtitle, color, iconSpin } = getStatusContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div
        className="
          bg-white rounded-2xl shadow-xl p-8 w-full max-w-md
          transition-all duration-500 ease-out
          animate-[fadeInScale_0.5s_ease-out]
        "
      >
        <div key={status} className="text-center animate-[fadeInY_0.3s_ease-out]">
          <div className="mb-6 animate-[popIn_0.3s_ease-out_0.2s_both]">
            <Icon className={`w-16 h-16 mx-auto ${color} ${iconSpin ? 'animate-spin' : ''}`} />
          </div>

          <h1
            className={`text-2xl font-bold ${color} mb-2 animate-[fadeIn_0.3s_ease-out_0.3s_both]`}
          >
            {title}
          </h1>

          <p className="text-gray-600 mb-6 animate-[fadeIn_0.3s_ease-out_0.4s_both]">{subtitle}</p>

          {status === 'success' && (
            <button
              onClick={() => navigate('/login')}
              className="
                bg-green-500 text-white px-6 py-3 rounded-lg font-medium
                hover:bg-green-600 transition-transform duration-150
                hover:scale-105 active:scale-95
                animate-[fadeInY_0.3s_ease-out_0.5s_both]
              "
            >
              Continue to Login
            </button>
          )}

          {(status === 'error' || status === 'invalid') && (
            <button
              onClick={() => navigate('/register')}
              className="
                bg-blue-500 text-white px-6 py-3 rounded-lg font-medium
                hover:bg-blue-600 transition-transform duration-150
                hover:scale-105 active:scale-95
                animate-[fadeInY_0.3s_ease-out_0.5s_both]
              "
            >
              Get New Verification Email
            </button>
          )}

          {status === 'verifying' && (
            <div className="mt-4 animate-[fadeIn_0.3s_ease-out_0.5s_both]">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="
                    bg-blue-500 h-2 rounded-full
                    animate-[fillBar_2s_ease-in-out]
                  "
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div
          className="
            absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full
            animate-[spin_20s_linear_infinite]
          "
        />
        <div
          className="
            absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full
            animate-[spin_25s_linear_infinite_reverse]
          "
        />
      </div>
    </div>
  );
}
