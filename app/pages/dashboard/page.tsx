import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardContainer } from './containers/DashboardContainer';
import { verifyAccessToken } from '@/app/lib/auth/jwt';
import { getClient } from '@/app/lib/db';
import { getSectionsByUser } from './services/sectionService';
import { getDebtsByUser } from './services/debtService';
import { getSummaryByUser } from './services/summaryService';

export default async function DashboardPage() {
  // Resolve authenticated user from the httpOnly cookie set at login
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  let userId: string;
  try {
    const payload = verifyAccessToken(token);
    userId = payload.userId;
  } catch {
    redirect('/login');
  }

  const db = getClient();

  const [sections, debts, summary] = await Promise.all([
    getSectionsByUser(db, userId),
    getDebtsByUser(db, userId),
    getSummaryByUser(db, userId),
  ]);

  return (
    <DashboardContainer
      sectionsData={sections}
      summary={summary}
      debts={debts}
    />
  );
}
