import prisma from "@/lib/prisma";
import { Documents } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data: Documents = await request.json();

    const { role, fileName, url, expires, category } = data;
    console.log(data);
    if (!fileName || !url) {
      return NextResponse.json(
        { message: "file url and name is required" },
        { status: 400 }
      );
    }

    if (expires) {
      const expiresDate = new Date(expires);
      data.status = expiresDate > new Date() ? "Not Active" : "Active";
    }

    if (!expires) {
      data.expires = "Empty";
    }

    if (!category) {
      data.category = "Empty";
    }

    if (!role) {
      return NextResponse.json(
        { message: "user role is required" },
        { status: 400 }
      );
    }
    await prisma.documents.create({
      data,
    });

    return NextResponse.json(
      { message: `${role} document added successfully` },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Documents failed to add" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const role = request.nextUrl.searchParams.get("role");

    if (!role) {
      return NextResponse.json(
        { message: "role is required" },
        { status: 400 }
      );
    }

    const result = await prisma.documents.findMany({
      where: {
        role,
      },
    });

    const document = result.map((doc) => {
      return {
        ...doc,
        expires: doc.noExpiration ? null : doc.expires,
      };
    });

    return NextResponse.json(
      { data: document, message: "Documents retrived successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Documents failed to retrive" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const id = request.nextUrl.searchParams.get("documentId");
    if (!id) {
      return NextResponse.json(
        { message: "document id is required" },
        { status: 400 }
      );
    }

    await prisma.documents.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json(
      { message: "Documents updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Documents failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("documentId");
    if (!id) {
      return NextResponse.json(
        { message: "document id is required" },
        { status: 400 }
      );
    }

    await prisma.documents.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Documents deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Documents failed to delete" },
      { status: 500 }
    );
  }
}
