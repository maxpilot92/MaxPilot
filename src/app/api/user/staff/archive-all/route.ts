// app/api/user/staff/archive-all/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Start a transaction to ensure all updates complete or none do
    const archivedStaff = await prisma.$transaction(async (tx) => {
      // Get all active staff IDs
      const activeStaff = await tx.staff.findMany({
        where: {
          archived: false,
        },
        select: {
          id: true,
        },
      });

      if (activeStaff.length === 0) {
        return {
          count: 0,
          message: "No active staff members found to archive",
        };
      }

      // Archive all active staff
      const result = await tx.staff.updateMany({
        where: {
          archived: false,
        },
        data: {
          archived: true,
          updatedAt: new Date(),
        },
      });

      return {
        count: result.count,
        message: `Successfully archived ${result.count} staff members`,
      };
    });

    return NextResponse.json({
      status: "success",
      data: archivedStaff,
    });
  } catch (error) {
    console.error("Error archiving staff:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to archive staff members",
      },
      { status: 500 }
    );
  }
}
