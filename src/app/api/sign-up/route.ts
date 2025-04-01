import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, fullName, companyName, accountType, role, managerEmail } =
      data;

    // Validate required fields
    if (!email || !fullName || !companyName || !accountType || !role) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
    // Find the user by email in Clerk
    const findUserResponse = await axios.get(
      `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(
        email
      )}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (findUserResponse.status !== 200) {
      console.error("Error finding user:", findUserResponse.data);
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const users = findUserResponse.data;

    if (!users || users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const userId = users[0].id;
    const companyId = uuidv4();
    // Update the user's metadata using axios
    const updateResponse = await axios.patch(
      `https://api.clerk.com/v1/users/${userId}/metadata`,
      {
        public_metadata: {
          fullName,
          companyName,
          accountType,
          role,
          managerEmail: managerEmail || null,
          companyId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // const client = await clerkClient();

    // const user = await client.users.getUser(email);
    // if (!user.publicMetadata.onboardingComplete) {
    //   const updatedUser = await client.users.updateUser(email, {
    //     publicMetadata: {
    //       fullName,
    //       companyName,
    //       accountType,
    //       role,
    //       managerEmail: managerEmail || null,
    //       companyId: uuidv4(),
    //     },
    //   });

    //   console.log("updatedUser", updatedUser.publicMetadata);
    // }
    const payload = {
      ...updateResponse.data,
      companyId,
    };
    console.log("payload", payload);
    return NextResponse.json(
      {
        success: true,
        message: "User metadata updated successfully",
        // data: updatedUser,
        data: payload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: "Error updating user metadata",
          error: error.response?.data,
        },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
