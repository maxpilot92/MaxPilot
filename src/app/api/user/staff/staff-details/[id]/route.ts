import { ApiError, ApiErrors } from "@/utils/ApiError";
import { ApiSuccess, HTTP_STATUS } from "@/utils/ApiSuccess";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

// Type for gender
type GenderStatus = "Male" | "Female";

// Type for role
type RoleStatus =
  | "Carer"
  | "Admin"
  | "Coordinator"
  | "HR"
  | "OfficeSupport"
  | "Ops"
  | "Kiosk"
  | "Others";

// Type for Employment status
type EmploymentTypeStatus =
  | "FullTime"
  | "PartTime"
  | "Casual"
  | "Contractor"
  | "Others";

interface StaffInputFlat {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dob: string;
  emergencyContact: string;
  language?: string;
  nationality?: string;
  gender?: GenderStatus;
  worksAt: string;
  hiredOn: string;
  role: RoleStatus;
  employmentType: EmploymentTypeStatus;
  team: string;
}

function validatePersonalDetails(data: StaffInputFlat): void {
  const requiredFields = [
    "fullName",
    "email",
    "phoneNumber",
    "address",
    "dob",
    "emergencyContact",
  ];

  const missingFields = requiredFields.filter(
    (field) => !data[field as keyof StaffInputFlat]
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

function validateWorkDetails(data: StaffInputFlat): void {
  const requiredFields = [
    "worksAt",
    "hiredOn",
    "role",
    "employmentType",
    "team",
  ];

  const missingFields = requiredFields.filter(
    (field) => !data[field as keyof StaffInputFlat]
  );

  if (missingFields.length > 0) {
    throw new ApiErrors(
      HTTP_STATUS.BAD_REQUEST,
      "Required work details missing",
      {
        fields: missingFields,
      }
    );
  }

  // Validate hire date
  const hiredOn = new Date(data.hiredOn);
  if (isNaN(hiredOn.getTime())) {
    throw new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Invalid hire date format");
  }
}

// GET single staff record with all details
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

    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        personalDetails: true,
        workDetails: true,
      },
    });

    if (!staff) {
      throw new ApiErrors(HTTP_STATUS.NOT_FOUND, "Staff member not found");
    }

    return ApiSuccess(staff, "Staff details retrieved successfully");
  } catch (error: unknown) {
    console.error("Error in GET staff details:", {
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
        "Error fetching staff details"
      )
    );
  }
}

// PUT update staff record
export async function PUT(request: NextRequest) {
  try {
    const data: StaffInputFlat = await request.json();
    const url = new URL(request.url);
    const splittedUrl = url.toString().split("/");
    const id = splittedUrl.at(-1);

    if (!id) {
      return ApiError(
        new ApiErrors(HTTP_STATUS.BAD_REQUEST, "ID parameter is required")
      );
    }

    // Validate both personal and work details
    validatePersonalDetails(data);
    validateWorkDetails(data);

    // Update staff record with related details using transaction
    const updatedStaff = await prisma.$transaction(async (prisma) => {
      const staff = await prisma.staff.findUnique({
        where: { id },
        include: {
          personalDetails: true,
          workDetails: true,
        },
      });

      if (!staff) {
        throw new ApiErrors(HTTP_STATUS.NOT_FOUND, "Staff member not found");
      }

      // Update personal details
      await prisma.personalDetails.update({
        where: { id: staff.personalDetailsId },
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

      // Update work details
      await prisma.workDetails.update({
        where: { id: staff.workDetailsId },
        data: {
          worksAt: data.worksAt,
          hiredOn: new Date(data.hiredOn),
          role: data.role,
          employmentType: data.employmentType,
          // teams: {
          //   set: { id: data.team },
          // },
        },
      });

      // Return updated staff with all relations
      return await prisma.staff.findUnique({
        where: { id },
        include: {
          personalDetails: true,
          workDetails: true,
        },
      });
    });

    return ApiSuccess(updatedStaff, "Staff details updated successfully");
  } catch (error: unknown) {
    console.error("Error in PUT staff details:", {
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
            "A staff member with this email or phone number already exists"
          )
        );
      }
      return ApiError(
        new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Database error occurred")
      );
    }

    return ApiError(
      new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Error updating staff details")
    );
  }
}
