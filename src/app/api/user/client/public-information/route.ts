import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

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

    if (!data.generalInfo && !data.needToKnowInfo && !data.usefulInfo) {
      return NextResponse.json(
        { error: "Public information is required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.staff.findUnique({
      where: {
        id: userId,
      },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
      
    }

    const publicInformation = await prisma.publicInformation.create({
      data: {
        ...data,
        needToKnowInfo: data.needToKnowInfo || { key: "", value: "" },
        usefulInfo: data.usefulInfo || { key: "", value: "" },
        Staff: {
          connect: {
            id: userId,
            role,
          }
        }
      }
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
    const role = "client"
    const userId = request.nextUrl.searchParams.get("userId");
    console.log(data, "data");

    if (!userId) {
      return NextResponse.json(
        { error: "User id is required" },
        { status: 400 }
      );
    }

    if (!data.generalInfo && !data.needToKnowInfo && !data.usefulInfo) {
      return NextResponse.json(
        { error: "Add something to update" },
        { status: 400 }
      );
    }

    const publicInformation = await prisma.publicInformation.update({
      where: { staffId: userId },
      data: {
        ...data,
        needToKnowInfo: data.needToKnowInfo || { key: "", value: "" },
        usefulInfo: data.usefulInfo || { key: "", value: "" },
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

    // Store in Redis cache for future requests
    if (publicInformation) {
      await redis.set(`${role}: ${userId}`, JSON.stringify(publicInformation));
    }

    return NextResponse.json({
      message: "Public information retrieved successfully",
      data: publicInformation || null,
    });
  } catch (error) {
    console.error("Error in GET public information:", error);
    return NextResponse.json(
      { error: "Error retrieving public information" },
      { status: 400 }
    );
  }
}
