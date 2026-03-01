/**
 * Sections Collection Endpoint
 * GET  /api/sections  — list all sections for the authenticated user
 * POST /api/sections  — create a new section
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { resolveUser } from '@/app/lib/auth/resolveUser';
import { getSectionsByUser, createSection } from '@/app/pages/dashboard/services/sectionService';
import { SectionLayoutType } from '@/app/pages/dashboard/dtos/dashboard.dto';

export async function GET(request: NextRequest) {
  try {
    const { userId } = resolveUser(request);
    const sections = await getSectionsByUser(getClient(), userId);
    return NextResponse.json(sections, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sections';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = resolveUser(request);
    const body = await request.json();

    const { title, icon, type, isIncome, actionLabel, order } = body;
    if (!title || !icon || !type) {
      return NextResponse.json({ error: 'title, icon and type are required' }, { status: 400 });
    }

    const section = await createSection(getClient(), userId, {
      title,
      icon,
      type: type as SectionLayoutType,
      isIncome: isIncome ?? false,
      actionLabel,
      order,
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create section';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
