import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('Invalid verification link');
      return;
    }

    fetch(`http://localhost:8000/api/auth/verify?token=${token}`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => setStatus(data.message || 'Verified!'))
      .catch(() => setStatus('Verification failed'));
  }, []);

  return <div>{status}</div>;
}
