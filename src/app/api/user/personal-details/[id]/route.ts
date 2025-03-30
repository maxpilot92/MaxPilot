import { ApiError, ApiErrors } from "@/utils/ApiError";
import { ApiSuccess, HTTP_STATUS } from "@/utils/ApiSuccess";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { PersonalDetails } from "@prisma/client";
import redis from "@/lib/redis";

function validatePersonalDetails(data: PersonalDetails): void {
  const requiredFields = [
    "fullName",
    "email",
    "phoneNumber",
    "address",
    "dob",
    "emergencyContact",
  ];

  const missingFields = requiredFields.filter(
    (field) => !data[field as keyof PersonalDetails]
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
  if (!data.dob) {
    throw new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Date of birth is required");
  }
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
    const data: PersonalDetails = await request.json();
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
    const user = await prisma.user.findUnique({
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
        dob: data.dob ? new Date(data.dob) : null,
        emergencyContact: data.emergencyContact,
        language: data.language,
        nationality: data.nationality,
        gender: data.gender,
      },
      include: {
        user: {
          include: {
            personalDetails: true,
            workDetails: true,
            publicInformation: true,
          },
        },
      },
    });

    if (!updatedPersonalDetails) {
      throw new ApiErrors(
        HTTP_STATUS.BAD_REQUEST,
        "Error updating personal details"
      );
    }
    const personalDetails = {
      ...updatedPersonalDetails,
      dob: updatedPersonalDetails.dob
        ? updatedPersonalDetails.dob.toISOString()
        : null,
    };

    const workDetails = {
      ...updatedPersonalDetails.user[0].workDetails,
    };

    const publicInformation = {
      ...updatedPersonalDetails.user[0].publicInformation,
    };

    const staff = {
      id: updatedPersonalDetails.user[0].id,
      role: updatedPersonalDetails.user[0].role,
      subRoles: updatedPersonalDetails.user[0].subRoles,
      personalDetailsId: updatedPersonalDetails.user[0].personalDetailsId,
      workDetailsId: updatedPersonalDetails.user[0].workDetailsId,
      archived: updatedPersonalDetails.user[0].archived,
      createdAt: updatedPersonalDetails.user[0].createdAt,
      updatedAt: updatedPersonalDetails.user[0].updatedAt,
      personalDetails,
      workDetails,
      publicInformation,
    };
    await redis.set(
      `${updatedPersonalDetails.user[0].role}:${updatedPersonalDetails.user[0].id}`,
      JSON.stringify(staff)
    );

    console.log("Data updated in cache");

    return ApiSuccess("Personal details updated successfully");
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
    const user = await prisma.user.findUnique({
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
