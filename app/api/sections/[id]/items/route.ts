/**
 * Section Items Collection Endpoint
 * POST /api/sections/[id]/items — add an item to a section
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { resolveUser } from '@/app/lib/auth/resolveUser';
import { createSectionItem } from '@/app/pages/dashboard/services/sectionService';
import { SectionItemVariantType } from '@/app/pages/dashboard/dtos/dashboard.dto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = resolveUser(request);
    const { id: sectionId } = await params;
    const body = await request.json();

    const { name, amount, variant } = body;
    if (!name || amount === undefined) {
      return NextResponse.json({ error: 'name and amount are required' }, { status: 400 });
    }

    const item = await createSectionItem(getClient(), sectionId, userId, {
      name,
      amount,
      variant: variant as SectionItemVariantType,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create section item';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
