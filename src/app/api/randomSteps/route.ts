import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log(req.url);
  const steps = [];
  for (let i = 0; i < 6; i++) {
    const wholePart = Math.floor(Math.random() * 99) + 1;
    const step = parseFloat(`${wholePart}.99`);
    steps.push(step);
  }

  const sortedSteps = steps.sort((a, b) => a - b);

  try {
    return NextResponse.json(sortedSteps);
  } catch (error) {
    console.error(error);
  }
}
