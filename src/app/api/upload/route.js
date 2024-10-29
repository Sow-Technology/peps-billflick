import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket } from "mongodb";

let mongoClient = null;

async function connectToDatabase() {
  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
  }
  return mongoClient.db("test");
}

const handleFileUpload = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const bucket = new GridFSBucket(db, {
      bucketName: "uploads",
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("Buffer size:", buffer.length);

    const uploadStream = bucket.openUploadStream(file.name, {
      contentType: file.type,
    });

    return new Promise((resolve, reject) => {
      uploadStream.end(buffer, (error) => {
        if (error) {
          console.error("Error during file upload:", error.message);
          reject(
            NextResponse.json(
              { error: "Error uploading file", details: error.message },
              { status: 500 }
            )
          );
        } else {
          const fileId = uploadStream.id;
          const fileUrl = `${process.env.AUTH_URL}/api/files?id=${fileId}`;
          console.log("File uploaded successfully:", fileId);
          resolve(
            NextResponse.json({
              message: "File uploaded successfully",
              fileUrl,
              fileId,
            })
          );
        }
      });

      const timeout = setTimeout(() => {
        uploadStream.destroy();
        reject(
          NextResponse.json(
            { error: "Upload process timed out." },
            { status: 504 }
          )
        );
      }, 30000);

      uploadStream.on("finish", () => clearTimeout(timeout));
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred", details: error.message },
      { status: 500 }
    );
  }
};

export async function POST(req) {
  console.log("Handling POST request for file upload");
  return handleFileUpload(req);
}

export const dynamic = "force-dynamic";
