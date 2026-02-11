
import React from 'react';

interface AuthTemplateProps {
  children: React.ReactNode;
  title: string;
}

export function AuthTemplate({ children, title }: AuthTemplateProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
}
