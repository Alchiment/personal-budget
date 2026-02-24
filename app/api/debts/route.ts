/**
 * Debts Collection Endpoint
 * GET  /api/debts  — list all debts for the authenticated user
 * POST /api/debts  — create a new debt card
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { resolveUser } from '@/app/lib/auth/resolveUser';
import { getDebtsByUser, createDebt } from '@/app/pages/dashboard/services/debtService';
import { DebtCardType, DebtColorType } from '@/app/pages/dashboard/dtos/dashboard.dto';

export async function GET(request: NextRequest) {
  try {
    const { userId } = resolveUser(request);
    const debts = await getDebtsByUser(getClient(), userId);
    return NextResponse.json(debts, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch debts';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = resolveUser(request);
    const body = await request.json();

    const { name, subtitle, type, color } = body;
    if (!name || !subtitle) {
      return NextResponse.json({ error: 'name and subtitle are required' }, { status: 400 });
    }

    const debt = await createDebt(getClient(), userId, {
      name,
      subtitle,
      type: type as DebtCardType,
      color: color as DebtColorType,
    });

    return NextResponse.json(debt, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create debt';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
