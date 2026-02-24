/**
 * Section Instance Endpoint
 * PATCH  /api/sections/[id]  — update a section
 * DELETE /api/sections/[id]  — delete a section
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { resolveUser } from '@/app/lib/auth/resolveUser';
import { updateSection, deleteSection } from '@/app/pages/dashboard/services/sectionService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = resolveUser(request);
    const { id } = await params;
    const body = await request.json();

    const section = await updateSection(getClient(), id, userId, body);
    return NextResponse.json(section, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update section';
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

    await deleteSection(getClient(), id, userId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete section';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
