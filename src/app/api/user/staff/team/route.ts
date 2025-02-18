// app/api/teams/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch all teams
// export async function GET(req: NextRequest) {
//   try {
//     const teams = await prisma.team.findMany({
//       include: {
//         workDetails: {
//           include: {
//             Staff: {
//               select: {
//                 id: true,
//                 personalDetails: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     return NextResponse.json({ success: true, data: teams }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching teams:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch teams" },
//       { status: 500 }
//     );
//   }
// }

// POST - Create a new team
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, staffIds } = body;
    console.log(body);

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "Team name is required" },
        { status: 400 }
      );
    }

    if (!staffIds || !Array.isArray(staffIds)) {
      return NextResponse.json(
        { success: false, error: "Staff IDs should be an array" },
        { status: 400 }
      );
    }
    // Create the new team and associate staff members
    const newTeam = await prisma.team.create({
      data: {
        name,
        staff: {
          connect: staffIds.map((id: string) => ({ id })),
        },
      },
      include: {
        staff: true,
      },
    });

    return NextResponse.json({ success: true, data: newTeam }, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create team" },
      { status: 500 }
    );
  }
}
