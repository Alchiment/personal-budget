'use client';

import { AuthTemplate } from '@/app/components/templates/AuthTemplate';
import { LoginForm } from '@/app/components/organisms/LoginForm';

export default function LoginPage() {
  return (
    <AuthTemplate title="Sign in to your account">
      <LoginForm />
    </AuthTemplate>
  );
}
