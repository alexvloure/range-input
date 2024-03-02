import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log(req.url);
  const value1: number = Math.random() * 100;
  const value2: number = Math.random() * 100;

  try {
    return NextResponse.json({
      min: Math.min(value1, value2),
      max: Math.max(value1, value2),
    });
  } catch (error) {
    console.error(error);
  }
}
