/**
 * Summary Endpoint
 * GET /api/summary — returns the computed budget summary for the authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { resolveUser } from '@/app/lib/auth/resolveUser';
import { getSummaryByUser } from '@/app/pages/dashboard/services/summaryService';

export async function GET(request: NextRequest) {
  try {
    const { userId } = resolveUser(request);
    const summary = await getSummaryByUser(getClient(), userId);
    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch summary';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
