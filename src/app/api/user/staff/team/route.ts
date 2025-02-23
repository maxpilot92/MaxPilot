// app/api/teams/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST - Create a new team

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, staffIds } = body;

    // Validate team name
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "Team name is required" },
        { status: 400 }
      );
    }

    // Validate staff IDs
    if (!staffIds || !Array.isArray(staffIds)) {
      return NextResponse.json(
        { success: false, error: "Staff IDs should be an array" },
        { status: 400 }
      );
    }

    // First, get the workDetails IDs for the provided staff
    const staffWithWorkDetails = await prisma.user.findMany({
      where: {
        id: {
          in: staffIds,
        },
      },
      select: {
        id: true,
        workDetailsId: true,
      },
    });

    if (staffWithWorkDetails.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid staff members found" },
        { status: 400 }
      );
    }

    const workDetailsIds = staffWithWorkDetails.map(
      (staff) => staff.workDetailsId
    );

    // Create the new team and associate work details
    const newTeam = await prisma.team.create({
      data: {
        name,
        workDetails: {
          connect: workDetailsIds
            .filter((id): id is string => id !== null) // Remove null values
            .map((id) => ({ id })),
        },
      },
      include: {
        workDetails: {
          select: {
            id: true,
            worksAt: true,
            role: true,
            employmentType: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newTeam,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack || "No stack trace",
      });

      if (error.message.includes("Foreign key constraint failed")) {
        return NextResponse.json(
          { success: false, error: "One or more staff IDs are invalid" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    console.log("Unknown error type:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create team" },
      { status: 500 }
    );
  }
}

// GET all teams
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const nameFilter = url.searchParams.get("name");

    const where: { name?: { contains: string; mode: "insensitive" } } = {};
    if (nameFilter) {
      where.name = {
        contains: nameFilter,
        mode: "insensitive",
      };
    }

    // Fetch and optimize data
    const teams = await prisma.team.findMany({
      where,
      include: {
        workDetails: {
          include: {
            User: {
              include: {
                personalDetails: {
                  select: { fullName: true }, // Get only fullName
                },
              },
            },
          },
        },
      },
    });

    if (teams.length === 0) {
      return NextResponse.json({ message: "No Teams found" }, { status: 404 });
    }

    // Transform data for a cleaner response
    const optimizedData = teams.map((team) => ({
      id: team.id,
      name: team.name,
      staff: team.workDetails.flatMap((work) =>
        work.User.map((staff) => ({
          fullName: staff.personalDetails.fullName,
        }))
      ),
    }));

    return NextResponse.json(
      { data: optimizedData, message: "Teams extracted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get teams" },
      { status: 500 }
    );
  }
}
