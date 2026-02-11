
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      router.push('/pages/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4 rounded-md shadow-sm">
        <FormField
          id="email-address"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          id="password"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>
    </form>
  );
}
