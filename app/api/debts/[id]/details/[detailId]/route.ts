/**
 * Debt Detail Instance Endpoint
 * PATCH  /api/debts/[id]/details/[detailId]  — update a detail
 * DELETE /api/debts/[id]/details/[detailId]  — delete a detail
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { resolveUser } from '@/app/lib/auth/resolveUser';
import { updateDebtDetail, deleteDebtDetail } from '@/app/pages/dashboard/services/debtService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; detailId: string }> }
) {
  try {
    const { userId } = resolveUser(request);
    const { detailId } = await params;
    const body = await request.json();

    const debt = await updateDebtDetail(getClient(), detailId, userId, {
      name: body.name,
      amount: body.amount,
    });

    return NextResponse.json(debt, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update debt detail';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; detailId: string }> }
) {
  try {
    const { userId } = resolveUser(request);
    const { detailId } = await params;

    const debt = await deleteDebtDetail(getClient(), detailId, userId);
    return NextResponse.json(debt, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete debt detail';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
