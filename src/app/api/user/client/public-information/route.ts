import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

interface PublicInformation {
  generalInfo: string;
  needToKnowInfo: {
    heading: string;
    description: string;
  };
  usefulInfo: {
    heading: string;
    description: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const userId = request.nextUrl.searchParams.get("userId");
    const role = "client";
    if (!userId || !role) {
      return NextResponse.json(
        { error: "User id and role are required" },
        { status: 400 }
      );
    }
    console.log(data);
    if (!data.generalInfo && !data.needToKnowInfo && !data.usefulInfo) {
      return NextResponse.json(
        { error: "Public information is required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    const publicInformation = await prisma.publicInformation.create({
      data: {
        ...data,
        needToKnowInfo: data.needToKnowInfo,
        usefulInfo: data.usefulInfo,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    if (!publicInformation) {
      return NextResponse.json(
        {
          error: "Failed to create public information",
        },
        { status: 400 }
      );
    }

    await redis.del(`${role}: ${userId}`);

    return NextResponse.json(
      {
        message: "Public information created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST public information:", error);
    return NextResponse.json(
      { error: "Error processing public information" },
      { status: 400 }
    );
  }
}

// For proper RESTful design, add a PUT method for updates
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const role = "client";
    const userId = request.nextUrl.searchParams.get("userId");

    // Handle case where userId is null
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get existing data first
    const existingInfo = await prisma.publicInformation.findUnique({
      where: { staffId: userId },
    });

    if (!existingInfo) {
      return NextResponse.json(
        { error: "Public information not found" },
        { status: 404 }
      );
    }

    // Prepare update data with proper merging
    const updateData = {} as PublicInformation;

    if (data.generalInfo !== undefined) {
      updateData.generalInfo = data.generalInfo;
    }

    if (data.needToKnowInfo !== undefined) {
      // If we already have needToKnowInfo, extend it
      if (existingInfo.needToKnowInfo) {
        // Make sure we're dealing with an object that can be spread
        const existingNeedToKnow =
          typeof existingInfo.needToKnowInfo === "object"
            ? existingInfo.needToKnowInfo
            : {};

        updateData.needToKnowInfo = {
          ...existingNeedToKnow,
          ...data.needToKnowInfo,
        };
      } else {
        updateData.needToKnowInfo = data.needToKnowInfo;
      }
    }

    if (data.usefulInfo !== undefined) {
      // Same for usefulInfo
      if (existingInfo.usefulInfo) {
        // Make sure we're dealing with an object that can be spread
        const existingUsefulInfo =
          typeof existingInfo.usefulInfo === "object"
            ? existingInfo.usefulInfo
            : {};

        updateData.usefulInfo = {
          ...existingUsefulInfo,
          ...data.usefulInfo,
        };
      } else {
        updateData.usefulInfo = data.usefulInfo;
      }
    }

    const publicInformation = await prisma.publicInformation.update({
      where: { staffId: userId },
      data: {
        ...updateData,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    if (!publicInformation) {
      return NextResponse.json(
        { error: "Failed to update public information" },
        { status: 400 }
      );
    }
    await redis.del(`${role}: ${userId}`);

    return NextResponse.json(
      {
        message: "Public information updated successfully",
        data: publicInformation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT public information:", error);
    return NextResponse.json(
      { error: "Error updating public information" },
      { status: 400 }
    );
  }
}
// Add a GET method to fetch existing public information
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const role = "client";

    if (!userId) {
      return NextResponse.json(
        { error: "User id is required" },
        { status: 400 }
      );
    }

    // First check Redis cache
    const cached = await redis.get(`${role}: ${userId}`);
    if (cached) {
      return NextResponse.json({
        message: "Public information retrieved from cache",
        data: JSON.parse(cached),
      });
    }

    // If not in cache, fetch from database
    const publicInformation = await prisma.publicInformation.findFirst({
      where: {
        staffId: userId,
      },
    });

    if (!publicInformation) {
      return NextResponse.json(
        { message: "No public information found" },
        { status: 404 }
      );
    }

    // Store in Redis cache for future requests
    await redis.set(`${role}: ${userId}`, JSON.stringify(publicInformation));

    return NextResponse.json({
      message: "Public information retrieved successfully",
      data: publicInformation,
    });
  } catch (error) {
    console.error("Error in GET public information:", error);
    return NextResponse.json(
      { error: "Error retrieving public information" },
      { status: 400 }
    );
  }
}
