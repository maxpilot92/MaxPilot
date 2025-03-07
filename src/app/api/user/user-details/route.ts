import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import redis from "@/lib/redis";

// Type definitions
enum RoleStatus {
  Carer = "Carer",
  Admin = "Admin",
  Coordinator = "Coordinator",
  HR = "HR",
  OfficeSupport = "OfficeSupport",
  Ops = "Ops",
  Kiosk = "Kiosk",
  Others = "Others",
}

enum EmploymentTypeStatus {
  FullTime = "FullTime",
  PartTime = "PartTime",
  Casual = "Casual",
  Contractor = "Contractor",
  Others = "Others",
}

enum GenderStatus {
  Male = "Male",
  Female = "Female",
}

enum MaritalStatus {
  Single = "Single",
  Married = "Married",
  Divorced = "Divorced",
  Widowed = "Widowed",
}

interface CreateUserInput {
  role?: string;
  personalDetails: {
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
  };
  workDetails?: {
    worksAt: string;
    hiredOn: string;
    role: RoleStatus;
    employmentType: EmploymentTypeStatus;
    teamId?: string;
  };
  publicInformation?: {
    generalInfo: string;
    needToKnowInfo: string;
    usefulInfo: string;
  };
}

// Validation functions
function validatePersonalDetails(
  data: CreateUserInput["personalDetails"]
): void {
  console.log(data, "At validate");
  const requiredFields = [
    "fullName",
    "email",
    "phoneNumber",
    "address",
    "dob",
    "emergencyContact",
  ];
  const missingFields = requiredFields.filter(
    (field) => !data[field as keyof typeof data]
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Required personal details missing: ${missingFields.join(", ")}`
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error("Invalid email format");
  }

  // Validate date of birth
  const dob = new Date(data.dob);
  if (isNaN(dob.getTime())) {
    throw new Error("Invalid date of birth format");
  }

  if (dob > new Date()) {
    throw new Error("Date of birth cannot be in the future");
  }
}

function validateWorkDetails(data: CreateUserInput["workDetails"]): void {
  if (!data) return;

  const requiredFields = ["worksAt", "hiredOn", "role", "employmentType"];
  const missingFields = requiredFields.filter(
    (field) => !data[field as keyof typeof data]
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Required work details missing: ${missingFields.join(", ")}`
    );
  }

  // Validate hire date
  const hiredOn = new Date(data.hiredOn);
  if (isNaN(hiredOn.getTime())) {
    throw new Error("Invalid hire date format");
  }

  if (hiredOn > new Date()) {
    throw new Error("Hire date cannot be in the future");
  }
}

// API Routes
export async function POST(request: NextRequest) {
  try {
    const data: CreateUserInput = await request.json();
    // Validate input data
    validatePersonalDetails(data.personalDetails);
    if (data.workDetails) {
      validateWorkDetails(data.workDetails);
    }

    // Check for existing user with same email
    const existingUser = await prisma.personalDetails.findUnique({
      where: { email: data.personalDetails.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create user with all related data in a transaction
    let newUser;
    await prisma.$transaction(async (tx) => {
      // Create personal details
      const personalDetails = await tx.personalDetails.create({
        data: {
          ...data.personalDetails,
          dob: new Date(data.personalDetails.dob),
        },
      });

      // Create work details if provided
      let workDetails;
      if (data.workDetails) {
        workDetails = await tx.workDetails.create({
          data: {
            ...data.workDetails,
            hiredOn: new Date(data.workDetails.hiredOn),
          },
        });
      }

      // Create public information if provided
      //   let publicInformation;
      //   if (data.publicInformation) {
      //     publicInformation = await tx.publicInformation.create({
      //       data: {
      //         generalInfo: data.publicInformation.generalInfo,
      //         needToKnowInfo: data.publicInformation.needToKnowInfo,
      //         usefulInfo: data.publicInformation.usefulInfo,
      //         User: {
      //           create: {
      //             role: data.role || "Staff",
      //             personalDetailsId: personalDetails.id,
      //             workDetailsId: workDetails?.id,
      //           },
      //         },
      //       },
      //     });
      //   } else {
      // Create user without public information
      newUser = await tx.staff.create({
        data: {
          role: workDetails ? "staff" : "client",
          personalDetailsId: personalDetails.id,
          workDetailsId: workDetails?.id,
        },
      });
    });
    return NextResponse.json(
      { message: "User created successfully", data: newUser },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create user",
      },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const gender = searchParams.get("gender");
    const userRole = searchParams.get("userRole")?.toLowerCase();
    const role = searchParams.get("role");
    const employmentType = searchParams.get("employmentType");
    const teamId = searchParams.get("teamId");
    const cacheKey = `${userRole}`;

    // if (!page || !limit || !gender || !role || !employmentType || !teamId) {
    //   try {
    //     const cachedData = await redis.get(cacheKey);
    //     if (cachedData) {
    //       console.log(cacheKey + " data retrieved from cache");
    //       return NextResponse.json(JSON.parse(cachedData));
    //     }
    //   } catch (cacheError) {
    //     console.error("Error accessing cache:", cacheError);
    //     // Continue with database query if cache access fails
    //   }
    // }

    console.log("redis caching failed");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.StaffWhereInput = {
      archived: false,
      ...(gender && {
        personalDetails: {
          gender: gender as GenderStatus,
        },
      }),
      ...(role && {
        workDetails: {
          role: role as RoleStatus,
        },
      }),
      ...(userRole && {
        role: userRole as RoleStatus,
      }),
      ...(employmentType && {
        workDetails: {
          employmentType: employmentType as EmploymentTypeStatus,
        },
      }),
      ...(teamId && {
        workDetails: {
          teamId: teamId,
        },
      }),
    };

    // Get users and total count
    const [users, total] = await Promise.all([
      prisma.staff.findMany({
        where,
        include: {
          personalDetails: true,
          workDetails: true,
          publicInformation: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.staff.count({ where }),
    ]);

    // Prepare response data
    const responseData = {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Store in Redis cache with expiration time of 20 minutes (1200 seconds)
    try {
      await redis.set(cacheKey, JSON.stringify(responseData), "EX", 1200);
    } catch (cacheError) {
      console.error("Error storing data in cache:", cacheError);
      // Continue with response even if caching fails
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
