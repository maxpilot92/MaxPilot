import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const clientId = request.nextUrl.searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json(
        { message: "Client ID is required" },
        { status: 400 }
      );
    }

    data.balance = data.amount;
    const fund = await prisma.fund.create({
      data: {
        ...data,
        client: {
          connect: {
            id: clientId,
          },
        },
      },
    });

    return NextResponse.json(
      { data: fund, message: "Fund created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while creating fund" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientId = request.nextUrl.searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json(
        { message: "Client ID is required" },
        { status: 400 }
      );
    }
    console.log(clientId);
    const funds = await prisma.fund.findMany({
      where: {
        clientId,
      },
    });

    if (!funds || funds.length === 0) {
      return NextResponse.json({ message: "No funds found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: funds, message: "Funds fetched" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while fetching funds" },
      { status: 500 }
    );
  }
}
