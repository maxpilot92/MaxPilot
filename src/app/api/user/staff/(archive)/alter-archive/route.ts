import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Add type for the operation parameter
type ArchiveOperation = "archive" | "unarchive";

interface BodyData {
  operation: ArchiveOperation;
  role: string;
}

export async function POST(request: Request) {
  try {
    const { operation, role } = (await request.json()) as BodyData;

    // Determine the current and target states based on operation
    const currentState = operation === "archive" ? false : true;
    const targetState = !currentState;

    const result = await prisma.$transaction(async (tx) => {
      // Get all staff in current state (excluding admins for archive operation)
      const staffToUpdate = await tx.staff.findMany({
        where: {
          role: role,
          archived: currentState,
          ...(operation === "archive" && {
            workDetails: {
              role: {
                not: "Admin",
              },
            },
          }),
        },
        select: {
          id: true,
        },
      });

      if (staffToUpdate.length === 0) {
        return {
          count: 0,
          message: `No ${
            currentState ? "archived" : "active"
          } staff members found to ${operation}`,
        };
      }

      // Update all matching staff
      const updateResult = await tx.staff.updateMany({
        where: {
          archived: currentState,
          ...(operation === "archive" && {
            workDetails: {
              role: {
                not: "Admin",
              },
            },
          }),
        },
        data: {
          archived: targetState,
          updatedAt: new Date(),
        },
      });

      return {
        count: updateResult.count,
        message: `Successfully ${operation}d ${updateResult.count} staff members`,
      };
    });

    return NextResponse.json({
      status: "success",
      ...result,
    });
  } catch (error) {
    console.error(`Error ${request.method} staff:`, error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to update staff members",
      },
      { status: 500 }
    );
  }
}
