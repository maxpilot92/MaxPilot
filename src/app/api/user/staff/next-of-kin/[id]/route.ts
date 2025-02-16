import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, relation, contact } = body;
    const url = new URL(request.url);
    const splittedUrl = url.toString().split("/");
    const staffId = splittedUrl.at(-1);

    if (!staffId) {
      return NextResponse.json({ message: "Staff id is required" });
    }

    // Validate required fields
    if (!name || !email || !relation || !contact) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new staff member
    const nextOfKin = await prisma.nextOfKin.create({
      data: {
        staffId,
        name,
        relation,
        contact,
        email,
      },
    });

    return NextResponse.json({ data: nextOfKin }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email or Staff ID already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const splittedUrl = url.toString().split("/");
    const staffId = splittedUrl.at(-1);
    if (!staffId) {
      return NextResponse.json({ message: "Staff id is required" });
    }
    const nextOfKin = await prisma.nextOfKin.findUnique({
      where: {
        staffId: staffId,
      },
    });

    if (!nextOfKin) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }
    console.log("running");
    return NextResponse.json({
      data: nextOfKin,
      message: "next of kin retrived successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/staff/[staffId]
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, relation, contact } = body;
    const url = new URL(request.url);
    const splittedUrl = url.toString().split("/");
    const staffId = splittedUrl.at(-1);

    if (!staffId) {
      return NextResponse.json({ message: "Staff id is required" });
    }
    // Validate required fields
    if (!name || !email || !relation || !contact) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const kinExist = await prisma.nextOfKin.findUnique({
      where: {
        staffId: staffId,
      },
    });

    if (!kinExist) {
      const nextOfKin = await prisma.nextOfKin.create({
        data: { ...body, staffId },
      });
      return NextResponse.json(
        { data: nextOfKin, message: "Next of kin added successfully" },
        { status: 201 }
      );
    }

    // Update staff member
    const updatedNextOfKin = await prisma.nextOfKin.update({
      where: {
        staffId: staffId,
      },
      data: {
        name,
        email,
        relation,
        contact,
      },
    });

    return NextResponse.json({
      data: updatedNextOfKin,
      message: "Next of kin updated successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
