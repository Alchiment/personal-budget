/**
 * Section Item Instance Endpoint
 * PATCH  /api/sections/[id]/items/[itemId]  — update a section item
 * DELETE /api/sections/[id]/items/[itemId]  — delete a section item
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { resolveUser } from '@/app/lib/auth/resolveUser';
import { updateSectionItem, deleteSectionItem } from '@/app/pages/dashboard/services/sectionService';
import { SectionItemVariantType } from '@/app/pages/dashboard/dtos/dashboard.dto';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { userId } = resolveUser(request);
    const { itemId } = await params;
    const body = await request.json();

    const item = await updateSectionItem(getClient(), itemId, userId, {
      name: body.name,
      amount: body.amount,
      variant: body.variant as SectionItemVariantType,
    });

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update section item';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { userId } = resolveUser(request);
    const { itemId } = await params;

    await deleteSectionItem(getClient(), itemId, userId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete section item';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
