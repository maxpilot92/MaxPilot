import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { EmploymentTypeStatus, Prisma, RoleStatus } from "@prisma/client";

type EmploymentType = EmploymentTypeStatus;
type Role = RoleStatus;

// interface FilterParams {
//   employmentType: EmploymentType | null;
//   role: Role | null;
//   teamId: string | null;
// }

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    const employmentType = searchParams.get(
      "employmentType"
    ) as EmploymentType | null;
    const role = searchParams.get("role") as Role | null;
    const teamId = searchParams.get("teamId");
    const userRole = searchParams.get("userRole")?.toLowerCase() as string;

    if (!userRole) {
      return NextResponse.json(
        { message: "User role is required" },
        { status: 404 }
      );
    }

    // Build the where clause for one-to-one relation with proper team relation handling
    const whereClause: Prisma.UserWhereInput = {
      archived: true,
      role: userRole,
    };

    const archivedStaff = await prisma.user.findMany({
      where: {
        ...whereClause,
        workDetails: {
          ...(userRole === "staff" && {
            employmentType: employmentType || undefined,
            role: role || undefined,
            teamId: teamId || undefined,
          }),
        },
      },
      include: {
        personalDetails: true,
        workDetails: userRole === "staff",
        publicInformation: userRole === "client",
      },
    });

    if (archivedStaff.length === 0) {
      return NextResponse.json(
        { message: "No staff archived" },
        { status: 404 }
      );
    }

    // const filters: FilterParams = {
    //   employmentType,
    //   role,
    //   teamId,
    // };

    return NextResponse.json(
      {
        data: archivedStaff,
        message: "Archived Staffs retrieved",
        // filters,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack || "No stack trace",
      });

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    console.log("Unknown error type:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get archived staff" },
      { status: 500 }
    );
  }
}
