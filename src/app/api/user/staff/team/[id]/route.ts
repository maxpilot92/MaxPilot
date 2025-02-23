import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Define the Team interface based on your Prisma model
interface Team {
  id: string;
  name: string;
  // Add other fields as per your Prisma model
}

// Define the ErrorResponse interface
interface ErrorResponse {
  message: string;
  errorDetails?: Record<string, string>;
}

// Helper function to extract ID from URL
function extractIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const id = urlObj.pathname.split("/").filter(Boolean).pop();
    return id || null;
  } catch {
    return null;
  }
}

// Type-safe error response helper
function createErrorResponse(
  message: string,
  status: number = 500,
  error?: unknown
): NextResponse<ErrorResponse> {
  const errorResponse: ErrorResponse = {
    message,
    errorDetails:
      error && typeof error === "object" && error !== null
        ? Object.getOwnPropertyNames(error).reduce((acc, key) => {
            acc[key] = String((error as Record<string, unknown>)[key]);
            return acc;
          }, {} as Record<string, string>)
        : { error: String(error) }, // Wrap non-object errors in an object
  };

  return NextResponse.json(errorResponse, { status });
}

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<ErrorResponse | { message: string; team: Team }>> {
  try {
    const id = extractIdFromUrl(request.url);

    if (!id) {
      return createErrorResponse("Invalid team ID", 400);
    }

    const deleteTeam = await prisma.team
      .delete({
        where: { id },
      })
      .catch(() => null);

    if (!deleteTeam) {
      return createErrorResponse("Team not found or could not be deleted", 404);
    }

    return NextResponse.json(
      { message: "Team deleted successfully", team: deleteTeam },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting team:", error);
    return createErrorResponse("Server error while deleting team", 500, error);
  }
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<ErrorResponse | { team: Team }>> {
  try {
    const id = extractIdFromUrl(request.url);

    if (!id) {
      return createErrorResponse("Invalid team ID", 400);
    }

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        workDetails: true,
      },
    });

    if (!team) {
      return createErrorResponse("Team not found", 404);
    }

    return NextResponse.json({ team }, { status: 200 });
  } catch (error) {
    console.error("Error fetching team:", error);
    return createErrorResponse("Server error while fetching team", 500, error);
  }
}
