import { NextResponse } from 'next/server';
import { getRankingMaster } from '@/actions/ranking';

export const revalidate = 604800;

export async function GET() {
  const data = await getRankingMaster();
  return NextResponse.json(data);
}
