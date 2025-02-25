import { ApiError, ApiErrors } from "@/utils/ApiError";
import { ApiSuccess, HTTP_STATUS } from "@/utils/ApiSuccess";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

// Type for gender
type GenderStatus = "Male" | "Female";

interface PersonalDetailsInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dob: string;
  emergencyContact: string;
  language?: string;
  nationality?: string;
  gender?: GenderStatus;
}

function validatePersonalDetails(data: PersonalDetailsInput): void {
  const requiredFields = [
    "fullName",
    "email",
    "phoneNumber",
    "address",
    "dob",
    "emergencyContact",
  ];

  const missingFields = requiredFields.filter(
    (field) => !data[field as keyof PersonalDetailsInput]
  );

  if (missingFields.length > 0) {
    throw new ApiErrors(
      HTTP_STATUS.BAD_REQUEST,
      "Required personal details missing",
      { fields: missingFields }
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Invalid email format");
  }

  // Validate date of birth
  const dob = new Date(data.dob);
  if (isNaN(dob.getTime())) {
    throw new ApiErrors(
      HTTP_STATUS.BAD_REQUEST,
      "Invalid date of birth format"
    );
  }
}

// PUT update personal details
export async function PUT(request: NextRequest) {
  try {
    const data: PersonalDetailsInput = await request.json();
    const url = new URL(request.url);
    const splittedUrl = url.toString().split("/");
    const id = splittedUrl.at(-1);

    if (!id) {
      return ApiError(
        new ApiErrors(HTTP_STATUS.BAD_REQUEST, "ID parameter is required")
      );
    }

    // Validate personal details
    validatePersonalDetails(data);

    // Find the staff member first
    const user = await prisma.staff.findUnique({
      where: { id },
      include: {
        personalDetails: true,
      },
    });

    if (!user) {
      throw new ApiErrors(HTTP_STATUS.NOT_FOUND, "Staff member not found");
    }

    // Update personal details
    const updatedPersonalDetails = await prisma.personalDetails.update({
      where: { id: user.personalDetailsId },
      data: {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        dob: new Date(data.dob),
        emergencyContact: data.emergencyContact,
        language: data.language,
        nationality: data.nationality,
        gender: data.gender,
      },
    });

    return ApiSuccess(
      updatedPersonalDetails,
      "Personal details updated successfully"
    );
  } catch (error: unknown) {
    console.error("Error in PUT personal details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof ApiErrors) {
      return ApiError(error);
    }

    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === "P2002") {
        return ApiError(
          new ApiErrors(
            HTTP_STATUS.CONFLICT,
            "A user with this email or phone number already exists"
          )
        );
      }
      return ApiError(
        new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Database error occurred")
      );
    }

    return ApiError(
      new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Error updating personal details")
    );
  }
}

// DELETE personal details
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const splittedUrl = url.toString().split("/");
    const id = splittedUrl.at(-1);

    if (!id) {
      return ApiError(
        new ApiErrors(HTTP_STATUS.BAD_REQUEST, "ID parameter is required")
      );
    }

    // Find the staff member first
    const user = await prisma.staff.findUnique({
      where: { id },
      include: {
        personalDetails: true,
      },
    });

    if (!user) {
      throw new ApiErrors(HTTP_STATUS.NOT_FOUND, "User member not found");
    }

    // Delete personal details
    await prisma.personalDetails.delete({
      where: { id: user.personalDetailsId },
    });

    return ApiSuccess(null, "Personal details deleted successfully");
  } catch (error: unknown) {
    console.error("Error in DELETE personal details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof ApiErrors) {
      return ApiError(error);
    }

    return ApiError(
      new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Error deleting personal details")
    );
  }
}
