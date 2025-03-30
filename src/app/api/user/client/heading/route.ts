import prisma from "@/lib/prisma";
import { Heading } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data: Heading = await request.json();
    const {
      needToKnowInfo,
      needToKnowMandatory,
      usefulInfo,
      usefulInfoMandatory,
    } = data;

    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    if (!needToKnowInfo && !usefulInfo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const isAdmin = await prisma.user.findUnique({
      where: {
        id: userId,
        role: "Admin",
      },
    });

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Only admin can add headings" },
        { status: 403 }
      );
    }

    const heading = await prisma.heading.create({
      data: {
        needToKnowInfo: needToKnowInfo ? needToKnowInfo : "",
        usefulInfo: usefulInfo ? usefulInfo : "",
        needToKnowMandatory: needToKnowMandatory ? needToKnowMandatory : false,
        usefulInfoMandatory: usefulInfoMandatory ? usefulInfoMandatory : false,
        adminId: userId,
      },
    });

    if (!heading) {
      return NextResponse.json(
        { error: "Failed to create heading" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Heading created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create heading" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const headingType = request.nextUrl.searchParams.get("headingType");

    const isNtk = headingType === "needToKnowInfo";

    if (!headingType) {
      return NextResponse.json(
        { error: "Missing heading type" },
        { status: 400 }
      );
    }

    const headings = await prisma.heading.findMany({
      select: {
        id: true,
        needToKnowInfo: isNtk,
        usefulInfo: !isNtk,
        needToKnowMandatory: isNtk,
        usefulInfoMandatory: !isNtk,
      },
    });

    if (!headings) {
      return NextResponse.json(
        { message: "No headings found" },
        { status: 404 }
      );
    }
    let filteredHeadings;
    if (isNtk) {
      filteredHeadings = headings.filter(
        (heading) => heading.needToKnowInfo !== ""
      );
    } else {
      filteredHeadings = headings.filter(
        (heading) => heading.usefulInfo !== ""
      );
    }

    return NextResponse.json(
      { data: filteredHeadings, message: "Headings retrieved" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to getting headings" },
      { status: 500 }
    );
  }
}
