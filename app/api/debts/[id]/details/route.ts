/**
 * Debt Details Collection Endpoint
 * POST /api/debts/[id]/details — add a detail/charge to a debt card
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { resolveUser } from '@/app/lib/auth/resolveUser';
import { createDebtDetail } from '@/app/pages/dashboard/services/debtService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = resolveUser(request);
    const { id: debtId } = await params;
    const body = await request.json();

    const { name, amount } = body;
    if (!name || amount === undefined) {
      return NextResponse.json({ error: 'name and amount are required' }, { status: 400 });
    }

    const debt = await createDebtDetail(getClient(), debtId, userId, { name, amount });
    return NextResponse.json(debt, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create debt detail';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
