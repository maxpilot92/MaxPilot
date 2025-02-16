import { ApiError, ApiErrors } from "@/utils/ApiError";
import { ApiSuccess, HTTP_STATUS } from "@/utils/ApiSuccess";
import prisma from "@/lib/prisma";

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

// Combined input interface to match incoming data
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

  if (dob > new Date()) {
    throw new ApiErrors(
      HTTP_STATUS.BAD_REQUEST,
      "Date of birth cannot be in the future"
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
      { fields: missingFields }
    );
  }

  // Validate hire date
  const hiredOn = new Date(data.hiredOn);
  if (isNaN(hiredOn.getTime())) {
    throw new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Invalid hire date format");
  }

  if (hiredOn > new Date()) {
    throw new ApiErrors(
      HTTP_STATUS.BAD_REQUEST,
      "Hire date cannot be in the future"
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: StaffInputFlat = await request.json();
    console.log(data);

    // Validate both personal and work details
    validatePersonalDetails(data);
    validateWorkDetails(data);

    // Check for existing staff member with same email
    const existingStaff = await prisma.personalDetails.findUnique({
      where: { email: data.email },
    });

    if (existingStaff) {
      throw new ApiErrors(
        HTTP_STATUS.CONFLICT,
        "Staff member with this email already exists"
      );
    }

    // Create staff record with related details using transaction
    const staff = await prisma.$transaction(async (prisma) => {
      // Create personal details
      const personalDetails = await prisma.personalDetails.create({
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

      // Create work details
      const workDetails = await prisma.workDetails.create({
        data: {
          worksAt: data.worksAt,
          hiredOn: new Date(data.hiredOn),
          role: data.role,
          employmentType: data.employmentType,
          // teams: {
          //   connect: { id: data.team },
          // },
        },
      });

      // Create staff record with relations
      return await prisma.staff.create({
        data: {
          personalDetailsId: personalDetails.id,
          workDetailsId: workDetails.id,
        },
        include: {
          personalDetails: true,
          workDetails: {
            include: {
              teams: true,
            },
          },
        },
      });
    });

    return ApiSuccess(
      staff,
      "Staff member created successfully",
      HTTP_STATUS.CREATED
    );
  } catch (error: unknown) {
    console.error("Error in POST staff details:", {
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
      new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Error creating staff member")
    );
  }
}
