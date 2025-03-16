import { ApiError, ApiErrors } from "@/utils/ApiError";
import { ApiSuccess, HTTP_STATUS } from "@/utils/ApiSuccess";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

interface ArchiveUpdateInput {
  archived: boolean;
}

// PUT endpoint to update archived status
export async function PUT(request: NextRequest) {
  try {
    const data: ArchiveUpdateInput = await request.json();
    const url = new URL(request.url);
    const splittedUrl = url.toString().split("/");
    const id = splittedUrl.at(-1);

    if (!id) {
      return ApiError(
        new ApiErrors(HTTP_STATUS.BAD_REQUEST, "ID parameter is required")
      );
    }

    // Validate archived field
    if (typeof data.archived !== "boolean") {
      return ApiError(
        new ApiErrors(
          HTTP_STATUS.BAD_REQUEST,
          "Archived status must be a boolean"
        )
      );
    }

    // Find the user first
    const user = await prisma.staff.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiErrors(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    // Update archived status
    const updatedUser = await prisma.staff.update({
      where: { id },
      data: {
        archived: data.archived ? false : true,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        archived: true,
        updatedAt: true,
      },
    });

    return ApiSuccess(
      updatedUser,
      `User ${data.archived ? "archived" : "unarchived"} successfully`
    );
  } catch (error: unknown) {
    console.error("Error in updating archive status:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof ApiErrors) {
      return ApiError(error);
    }

    return ApiError(
      new ApiErrors(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error updating archive status"
      )
    );
  }
}

// GET endpoint to check archive status
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const splittedUrl = url.toString().split("/");
    const id = splittedUrl.at(-1);

    if (!id) {
      return ApiError(
        new ApiErrors(HTTP_STATUS.BAD_REQUEST, "ID parameter is required")
      );
    }

    const user = await prisma.staff.findUnique({
      where: { id },
      select: {
        id: true,
        archived: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiErrors(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    return ApiSuccess(user, "Archive status retrieved successfully");
  } catch (error: unknown) {
    console.error("Error in getting archive status:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof ApiErrors) {
      return ApiError(error);
    }

    return ApiError(
      new ApiErrors(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error retrieving archive status"
      )
    );
  }
}
