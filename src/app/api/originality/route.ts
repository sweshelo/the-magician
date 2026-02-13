import { NextResponse } from 'next/server';
import { getOriginalityMap } from '@/actions/originality';

export const revalidate = 604800;

export async function GET() {
  const data = await getOriginalityMap();
  return NextResponse.json(data);
}
