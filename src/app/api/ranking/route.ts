import { NextResponse } from 'next/server';
import { getWeightedRanking } from '@/actions/ranking';

export const revalidate = 86400;

export async function GET() {
  try {
    const data = await getWeightedRanking();
    return NextResponse.json(data);
  } catch {
    return NextResponse.error();
  }
}
