import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";

let client = null;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db();
}

export async function GET(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  console.log("Received request for file ID:", id);

  if (!id || !ObjectId.isValid(id)) {
    console.log("Invalid file ID:", id);
    return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
  }

  try {
    const database = await connectToDatabase();
    console.log("Connected to database");

    const bucket = new GridFSBucket(database, {
      bucketName: "uploads", // Make sure this matches your bucket name
    });

    const _id = new ObjectId(id);
    console.log("Searching for file with _id:", _id.toString());

    // First, check if the file exists in the files collection
    const filesCollection = database.collection("uploads.files");
    const fileMetadata = await filesCollection.findOne({ _id });

    if (!fileMetadata) {
      console.log("File metadata not found in uploads.files collection");
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    console.log("File metadata found:", fileMetadata);

    const downloadStream = bucket.openDownloadStream(_id);

    // Set up error handling for the stream
    downloadStream.on("error", (error) => {
      console.error("Error in download stream:", error);
    });

    const headers = new Headers();
    headers.set(
      "Content-Type",
      fileMetadata.contentType || "application/octet-stream"
    );
    headers.set(
      "Content-Disposition",
      `inline; filename="${fileMetadata.filename}"`
    );

    console.log("Streaming file to response");

    return new NextResponse(downloadStream, { headers });
  } catch (error) {
    console.error("Error retrieving file:", error);
    return NextResponse.json(
      { error: "Error retrieving file", details: error.message },
      { status: 500 }
    );
  }
}
