import { ApiError, ApiErrors } from "@/utils/ApiError";
import { ApiSuccess, HTTP_STATUS } from "@/utils/ApiSuccess";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import redis from "@/lib/redis";

// Type for gender
type GenderStatus = "Male" | "Female";

// Type for marital status
type MaritalStatus = "Single" | "Married" | "Divorced" | "Widowed";

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

// Common personal details interface
interface PersonalDetailsInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dob: string;
  emergencyContact: string;
  language?: string;
  nationality?: string;
  religion?: string;
  gender?: GenderStatus;
  unit?: string;
  maritalStatus?: MaritalStatus;
}

// Staff input interface
interface StaffInput extends PersonalDetailsInput {
  worksAt: string;
  hiredOn: string;
  role: RoleStatus;
  employmentType: EmploymentTypeStatus;
  team: string;
}

// Client input interface
interface ClientInput extends PersonalDetailsInput {
  publicInformation?: {
    generalInfo?: string;
    needToKnowInfo?: string;
    usefulInfo?: string;
  };
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

function validateWorkDetails(data: StaffInput): void {
  const requiredFields = [
    "worksAt",
    "hiredOn",
    "role",
    "employmentType",
    "team",
  ];

  const missingFields = requiredFields.filter(
    (field) => !data[field as keyof StaffInput]
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

// Helper function to determine if the record is a staff or client
async function getRecordType(id: string) {
  // Try to get data from Redis cache first
  try {
    // Check if data exists in Redis
    const staffCacheData = await redis.get(`staff:${id}`);
    if (staffCacheData) {
      console.log("Staff data retrieved from cache");
      return { type: "staff", record: JSON.parse(staffCacheData) };
    }

    const clientCacheData = await redis.get(`client:${id}`);
    if (clientCacheData) {
      console.log("Client data retrieved from cache");
      return { type: "client", record: JSON.parse(clientCacheData) };
    }

    // If not in cache, query from database
    console.log("Data not found in cache, querying database...");

    // First check if it's a staff member (not a client)
    const staff = await prisma.staff.findFirst({
      where: {
        id,
        role: { not: "client" },
        archived: false,
      },
      include: {
        personalDetails: true,
        workDetails: true,
        PublicInformation: true,
      },
    });

    if (staff) {
      await redis.set(`staff:${id}`, JSON.stringify(staff), "EX", 1200);
      return { type: "staff", record: staff };
    }

    // If not staff, check if it's a client
    const client = await prisma.staff.findFirst({
      where: {
        id,
        role: "client",
        archived: false,
      },
      include: {
        personalDetails: true,
        PublicInformation: true,
      },
    });

    if (client) {
      await redis.set(`client:${id}`, JSON.stringify(client), "EX", 1200);
      return { type: "client", record: client };
    }

    return { type: null, record: null };
  } catch (error) {
    console.error("Error accessing cache:", error);

    // If there's a Redis error, fall back to database query
    const staff = await prisma.staff.findFirst({
      where: {
        id,
        role: { not: "client" },
        archived: false,
      },
      include: {
        personalDetails: true,
        workDetails: true,
        PublicInformation: true,
      },
    });

    if (staff) {
      return { type: "staff", record: staff };
    }

    const client = await prisma.staff.findFirst({
      where: {
        id,
        role: "client",
        archived: false,
      },
      include: {
        personalDetails: true,
        PublicInformation: true,
      },
    });

    if (client) {
      return { type: "client", record: client };
    }

    return { type: null, record: null };
  }
}

// GET single record (staff or client) with all details
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

    // Check if skip cache parameter is provided
    const skipCache = url.searchParams.get("skipCache") === "true";

    if (skipCache) {
      // If skip cache is true, invalidate the cache for this ID
      await redis.del(`staff:${id}`);
      await redis.del(`client:${id}`);
      console.log("Cache invalidated due to skipCache parameter");
    }

    const { type, record } = await getRecordType(id);

    if (!record) {
      throw new ApiErrors(HTTP_STATUS.NOT_FOUND, "Record not found");
    }

    return ApiSuccess(
      record,
      `${type === "staff" ? "Staff" : "Client"} details retrieved successfully`
    );
  } catch (error: unknown) {
    console.error("Error in GET details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof ApiErrors) {
      return ApiError(error);
    }

    return ApiError(
      new ApiErrors(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Error fetching details")
    );
  }
}

// PUT update record (staff or client)
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const splittedUrl = url.toString().split("/");
    const id = splittedUrl.at(-1);

    if (!id) {
      return ApiError(
        new ApiErrors(HTTP_STATUS.BAD_REQUEST, "ID parameter is required")
      );
    }

    // First determine if we're updating a staff or client
    const { type, record } = await getRecordType(id);

    if (!record) {
      throw new ApiErrors(HTTP_STATUS.NOT_FOUND, "Record not found");
    }

    const data = await request.json();

    // Validate personal details for both staff and client
    validatePersonalDetails(data);

    // For staff, also validate work details
    if (type === "staff" && record.role !== "client") {
      validateWorkDetails(data as StaffInput);
    }

    // Update record with related details using transaction
    const updatedRecord = await prisma.$transaction(async (prisma) => {
      // Update personal details
      await prisma.personalDetails.update({
        where: { id: record.personalDetailsId },
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
          religion: data.religion,
          unit: data.unit,
          maritalStatus: data.maritalStatus,
        },
      });

      // Update work details for staff
      if (
        type === "staff" &&
        record.workDetailsId &&
        record.role !== "client"
      ) {
        const staffData = data as StaffInput;
        await prisma.workDetails.update({
          where: { id: record.workDetailsId },
          data: {
            worksAt: staffData.worksAt,
            hiredOn: new Date(staffData.hiredOn),
            role: staffData.role,
            employmentType: staffData.employmentType,
            teamId: staffData.team,
          },
        });
      }

      // Update public information for client
      if (record.role === "client") {
        const clientData = data as ClientInput;

        // Check if public information already exists
        if (record.PublicInformation && record.PublicInformation.id) {
          await prisma.publicInformation.update({
            where: { id: record.PublicInformation.id },
            data: {
              generalInfo: clientData.publicInformation?.generalInfo || "",
              needToKnowInfo:
                clientData.publicInformation?.needToKnowInfo || "",
              usefulInfo: clientData.publicInformation?.usefulInfo || "",
            },
          });
        } else {
          // Create public information if it doesn't exist
          await prisma.publicInformation.create({
            data: {
              generalInfo: clientData.publicInformation?.generalInfo || "",
              needToKnowInfo:
                clientData.publicInformation?.needToKnowInfo || "",
              usefulInfo: clientData.publicInformation?.usefulInfo || "",
              Staff: {
                connect: { id: record.id },
              },
            },
          });
        }
      }

      // Return updated record with all relations
      return await prisma.staff.findUnique({
        where: { id },
        include: {
          personalDetails: true,
          workDetails: record.role !== "client" ? true : undefined,
          PublicInformation: record.role === "client" ? true : undefined,
        },
      });
    });

    // Invalidate cache after update
    await redis.del(`staff:${id}`);
    await redis.del(`client:${id}`);

    // Update cache with new data
    if (type === "staff") {
      await redis.set(`staff:${id}`, JSON.stringify(updatedRecord), "EX", 1200);
    } else {
      await redis.set(
        `client:${id}`,
        JSON.stringify(updatedRecord),
        "EX",
        1200
      );
    }

    return ApiSuccess(
      updatedRecord,
      `${
        type === "staff" && record.role !== "client" ? "Staff" : "Client"
      } details updated successfully`
    );
  } catch (error: unknown) {
    console.error("Error in PUT details:", {
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
            "A record with this email or phone number already exists"
          )
        );
      }
      return ApiError(
        new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Database error occurred")
      );
    }

    return ApiError(
      new ApiErrors(HTTP_STATUS.BAD_REQUEST, "Error updating details")
    );
  }
}

// DELETE a record (staff or client)
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

    const { type, record } = await getRecordType(id);

    if (!record) {
      throw new ApiErrors(HTTP_STATUS.NOT_FOUND, "Record not found");
    }

    // Instead of deleting, mark the record as archived
    await prisma.staff.update({
      where: { id },
      data: { archived: true },
    });

    // Invalidate cache after archiving
    await redis.del(`staff:${id}`);
    await redis.del(`client:${id}`);

    return ApiSuccess(
      null,
      `${
        type === "staff" && record.role !== "client" ? "Staff" : "Client"
      } archived successfully`
    );
  } catch (error: unknown) {
    console.error("Error in DELETE operation:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof ApiErrors) {
      return ApiError(error);
    }

    return ApiError(
      new ApiErrors(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Error archiving record")
    );
  }
}
