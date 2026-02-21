'use client';

import { AuthTemplate } from '@/app/components/templates/AuthTemplate';
import { RegisterForm } from '@/app/components/organisms/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthTemplate title="Create your account">
      <RegisterForm />
    </AuthTemplate>
  );
}
