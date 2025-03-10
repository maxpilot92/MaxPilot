import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log(data);

    // Map the incoming data to match the Prisma schema
    const shiftData = {
      client: data.clientId ? { connect: { id: data.clientId } } : undefined,
      carer: data.carerId ? { connect: { id: data.carerId } } : undefined,
      payGroup: data.payGroup,
      priceBook: data.priceBook,
      funds: data.funds,
      shiftType: data.shiftType,
      additionalShiftType: data.additionalShiftType,
      allowance: data.allowance,
    };

    const shift = await prisma.shift.create({
      data: shiftData,
    });

    return NextResponse.json(
      { data: shift, message: "shift added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "shift failed to schedule", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const shift = await prisma.shift.findMany();
    return NextResponse.json(
      { data: shift, message: "shift retrived successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "shift failed to schedule", error },
      { status: 500 }
    );
  }
}
