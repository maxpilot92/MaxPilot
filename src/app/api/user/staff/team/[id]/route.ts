// // app/api/teams/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// interface Params {
//   params: {
//     id: string;
//   };
// }

// // GET - Fetch a specific team
// export async function GET(req: NextRequest, { params }: Params) {
//   try {
//     const { id } = params;

//     const team = await prisma.team.findUnique({
//       where: { id },
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

//     if (!team) {
//       return NextResponse.json(
//         { success: false, error: "Team not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true, data: team }, { status: 200 });
//   } catch (error) {
//     console.error(`Error fetching team with ID ${params.id}:`, error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch team" },
//       { status: 500 }
//     );
//   }
// }

// // PATCH - Update a team
// export async function PATCH(req: NextRequest, { params }: Params) {
//   try {
//     const { id } = params;
//     const body = await req.json();
//     const { name, workDetailIds } = body;

//     // Check if team exists
//     const existingTeam = await prisma.team.findUnique({
//       where: { id },
//       include: { workDetails: true },
//     });

//     if (!existingTeam) {
//       return NextResponse.json(
//         { success: false, error: "Team not found" },
//         { status: 404 }
//       );
//     }

//     // Prepare update data
//     const updateData: any = {};
//     if (name !== undefined) updateData.name = name;

//     // Update team
//     const updatedTeam = await prisma.team.update({
//       where: { id },
//       data: {
//         ...updateData,
//         ...(workDetailIds && {
//           workDetails: {
//             set: [], // First disconnect all
//             connect: workDetailIds.map((wdId: string) => ({ id: wdId })), // Then connect new ones
//           },
//         }),
//       },
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

//     return NextResponse.json(
//       { success: true, data: updatedTeam },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(`Error updating team with ID ${params.id}:`, error);
//     return NextResponse.json(
//       { success: false, error: "Failed to update team" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete a team
// export async function DELETE(req: NextRequest, { params }: Params) {
//   try {
//     const { id } = params;

//     // Check if team exists
//     const existingTeam = await prisma.team.findUnique({ where: { id } });
//     if (!existingTeam) {
//       return NextResponse.json(
//         { success: false, error: "Team not found" },
//         { status: 404 }
//       );
//     }

//     // Delete team
//     await prisma.team.delete({ where: { id } });

//     return NextResponse.json(
//       { success: true, message: "Team deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(`Error deleting team with ID ${params.id}:`, error);
//     return NextResponse.json(
//       { success: false, error: "Failed to delete team" },
//       { status: 500 }
//     );
//   }
// }
