/**
 * Dashboard Endpoint
 * POST /api/dashboard — save all dashboard data (sections with items, debts with details)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { resolveUser } from '@/app/lib/auth/resolveUser';
import { saveDashboard } from '@/app/pages/dashboard/services/dashboardService';

export async function POST(request: NextRequest) {
  try {
    const { userId } = resolveUser(request);
    const body = await request.json();

    const { sections, debts } = body;

    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'sections must be an array' }, { status: 400 });
    }

    if (!Array.isArray(debts)) {
      return NextResponse.json({ error: 'debts must be an array' }, { status: 400 });
    }

    const result = await saveDashboard(getClient(), userId, {
      sections,
      debts,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save dashboard';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
