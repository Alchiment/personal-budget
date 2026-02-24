/**
 * Debt Instance Endpoint
 * PATCH  /api/debts/[id]  — update a debt card
 * DELETE /api/debts/[id]  — delete a debt card
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { resolveUser } from '@/app/lib/auth/resolveUser';
import { updateDebt, deleteDebt } from '@/app/pages/dashboard/services/debtService';
import { DebtColorType } from '@/app/pages/dashboard/dtos/dashboard.dto';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = resolveUser(request);
    const { id } = await params;
    const body = await request.json();

    const debt = await updateDebt(getClient(), id, userId, {
      name: body.name,
      subtitle: body.subtitle,
      color: body.color as DebtColorType,
    });

    return NextResponse.json(debt, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update debt';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = resolveUser(request);
    const { id } = await params;

    await deleteDebt(getClient(), id, userId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete debt';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
