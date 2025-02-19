import { ApiError, ApiErrors } from "@/utils/ApiError";
import { ApiSuccess, HTTP_STATUS } from "@/utils/ApiSuccess";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

// Define roles as a constant object for runtime use
const ROLES = {
  Carer: "Carer",
  Admin: "Admin",
  Coordinator: "Coordinator",
  HR: "HR",
  OfficeSupport: "OfficeSupport",
  Ops: "Ops",
  Kiosk: "Kiosk",
  Others: "Others",
} as const;

// Define employment types as a constant object for runtime use
const EMPLOYMENT_TYPES = {
  FullTime: "FullTime",
  PartTime: "PartTime",
  Casual: "Casual",
  Contractor: "Contractor",
  Others: "Others",
} as const;

// Type for role
type RoleStatus = (typeof ROLES)[keyof typeof ROLES];

// Type for Employment status
type EmploymentTypeStatus =
  (typeof EMPLOYMENT_TYPES)[keyof typeof EMPLOYMENT_TYPES];

interface WorkDetailsInput {
  worksAt: string;
  hiredOn: string;
  role: RoleStatus;
  employmentType: EmploymentTypeStatus;
  team: string;
}

interface TeamConnect {
  id: string;
}

// Interface for team update operations
interface TeamUpdateOperation {
  set: TeamConnect[];
  connect: TeamConnect[];
}

// Interface for work details update data
interface WorkDetailsUpdateInput {
  worksAt: string;
  hiredOn: Date;
  role: RoleStatus;
  employmentType: EmploymentTypeStatus;
  teams?: TeamUpdateOperation;
}

function validateWorkDetails(data: WorkDetailsInput): void {
  const requiredFields = ["worksAt", "hiredOn", "role", "employmentType"];

  const missingFields = requiredFields.filter(
    (field) => !data[field as keyof WorkDetailsInput]
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

  // Validate role
  if (!Object.values(ROLES).includes(data.role as RoleStatus)) {
    throw new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Invalid role");
  }

  // Validate employment type
  if (
    !Object.values(EMPLOYMENT_TYPES).includes(
      data.employmentType as EmploymentTypeStatus
    )
  ) {
    throw new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Invalid employment type");
  }
}

// GET work details
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
        workDetails: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!staff) {
      throw new ApiErrors(HTTP_STATUS.NOT_FOUND, "Staff member not found");
    }

    if (!staff.workDetails) {
      throw new ApiErrors(HTTP_STATUS.NOT_FOUND, "Work details not found");
    }

    return ApiSuccess(staff.workDetails, "Work details retrieved successfully");
  } catch (error: unknown) {
    console.error("Error in GET work details:", {
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
        "Error fetching work details"
      )
    );
  }
}

// PUT update work details
export async function PUT(request: NextRequest) {
  try {
    const data: WorkDetailsInput = await request.json();
    const url = new URL(request.url);
    const splittedUrl = url.toString().split("/");
    const id = splittedUrl.at(-1);

    if (!id) {
      return ApiError(
        new ApiErrors(HTTP_STATUS.BAD_REQUEST, "ID parameter is required")
      );
    }

    // Validate work details
    validateWorkDetails(data);

    // Find the staff member first
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        workDetails: true,
      },
    });

    if (!staff) {
      throw new ApiErrors(HTTP_STATUS.NOT_FOUND, "Staff member not found");
    }

    // Prepare update data
    const updateData: WorkDetailsUpdateInput = {
      worksAt: data.worksAt,
      hiredOn: new Date(data.hiredOn),
      role: data.role,
      employmentType: data.employmentType,
    };

    // Only include teams update if team ID is provided
    if (data.team) {
      updateData.teams = {
        set: [], // Clear existing connections
        connect: [{ id: data.team }], // Connect new team
      };
    }

    // Update work details
    const updatedWorkDetails = await prisma.workDetails.update({
      where: { id: staff.workDetailsId },
      data: updateData,
    });

    return ApiSuccess(updatedWorkDetails, "Work details updated successfully");
  } catch (error: unknown) {
    console.error("Error in PUT work details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof ApiErrors) {
      return ApiError(error);
    }

    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === "P2025") {
        return ApiError(new ApiErrors(HTTP_STATUS.NOT_FOUND, "Team not found"));
      }
      return ApiError(
        new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Database error occurred")
      );
    }

    return ApiError(
      new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Error updating work details")
    );
  }
}

// DELETE work details
// export async function DELETE(request: NextRequest) {
//   try {
//     const url = new URL(request.url);
//     const splittedUrl = url.toString().split("/");
//     const id = splittedUrl.at(-1);

//     if (!id) {
//       return ApiError(
//         new ApiErrors(HTTP_STATUS.BAD_REQUEST, "ID parameter is required")
//       );
//     }

//     // Find the staff member first
//     const staff = await prisma.staff.findUnique({
//       where: { id },
//       include: {
//         workDetails: true,
//       },
//     });

//     if (!staff) {
//       throw new ApiErrors(HTTP_STATUS.NOT_FOUND, "Staff member not found");
//     }

//     // Delete work details
//     await prisma.workDetails.delete({
//       where: { id: staff.workDetailsId },
//     });

//     return ApiSuccess(null, "Work details deleted successfully");
//   } catch (error: unknown) {
//     console.error("Error in DELETE work details:", {
//       name: error instanceof Error ? error.name : "Unknown",
//       message: error instanceof Error ? error.message : "Unknown error",
//       stack: error instanceof Error ? error.stack : undefined,
//     });

//     if (error instanceof ApiErrors) {
//       return ApiError(error);
//     }

//     return ApiError(
//       new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Error deleting work details")
//     );
//   }
// }
