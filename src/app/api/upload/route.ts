import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const region = process.env.AWS_REGION!;
const bucketName = process.env.AWS_BUCKET_NAME!;

if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
  throw new Error("Missing AWS S3 environment variables");
}

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    // Check if the file is present
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check if the file is an instance of Blob (or File in browser environments)
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename with timestamp
    const fileName = `uploads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    // Upload the file to S3
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const directUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

    return NextResponse.json({
      fileName,
      directUrl,
    });
  } catch (error) {
    console.error("S3 upload error:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
