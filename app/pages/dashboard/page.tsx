import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardContainer } from './containers/DashboardContainer';
import { verifyAccessToken } from '@/app/lib/auth/jwt';
import { getClient } from '@/app/lib/db';
import { getSectionsByUser } from './services/sectionService';
import { getDebtsByUser } from './services/debtService';
import { getSummaryByUser } from './services/summaryService';
import { AuthService } from '../auth/services/auth.service';

export default async function DashboardPage() {
  // Resolve authenticated user from the httpOnly cookie set at login
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  let userId: string;
  let userName: string | undefined;
  let userEmail: string;
  try {
    const payload = verifyAccessToken(token);
    userId = payload.userId;
    userName = payload.name;
    userEmail = payload.email;
  } catch {
    redirect('/login');
  }

  const db = getClient();
  const authService = new AuthService(db);

  const user = await authService.getUserById(userId);
  if (!user) {
    redirect('/login');
  }

  const [sections, debts, summary] = await Promise.all([
    getSectionsByUser(db, userId),
    getDebtsByUser(db, userId),
    getSummaryByUser(db, userId),
  ]);

  return (
    <DashboardContainer
      userName={user.name || undefined}
      userEmail={user.email}
      sectionsData={sections}
      summary={summary}
      debts={debts}
    />
  );
}
