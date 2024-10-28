import { uploadToDropbox } from "@/lib/connectDropbox";
import dbConnect from "@/lib/dbConnect";
import { formatDbResponse } from "@/lib/formatDbResponse";
import Claims from "@/models/Claims";
import { NextRequest, NextResponse } from "next/server";


export async function POST(){
  return NextResponse.json({message:"this is a test"},{status:200})
}


export async function GET() {
  await dbConnect();
  try {
    // Fetch claims
    const claims = await Claims.find();

    if (!claims) {
      return NextResponse.json({ error: "Claims not found" }, { status: 404 });
    }
    return NextResponse.json({ claims: formatDbResponse(claims) });
  } catch (error) {
    console.error("Error fetching claims:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing claims ID" }, { status: 400 });
  }

  await dbConnect();

  try {
    const formData = await req.formData();
    const updatedData = Object.fromEntries(formData);

    // Check if a new image is provided
    const newImage = formData.get("image") as File | null;

    if (newImage && newImage instanceof File) {
      try {
        // Create a unique filename
        const filename = `${Date.now()}-${newImage.name || "image"}`;
        const dropboxPath = `/claims/${filename}`;

        // Upload to Dropbox
        const imagePath = await uploadToDropbox(newImage, dropboxPath);

        console.log("New image uploaded to Dropbox:", imagePath);

        // Update the image path in the updatedData
        updatedData.image = imagePath;
      } catch (error) {
        console.error("Error uploading new image to Dropbox:", error);
        return NextResponse.json({ error: "Error uploading new image" }, { status: 500 });
      }
    } else {
      // If no new image is provided, remove the image field from updatedData
      // to prevent overwriting the existing image path with null
      delete updatedData.image;
    }

    const claims = await Claims.findByIdAndUpdate(id, updatedData, { new: true });
    if (!claims) {
      return NextResponse.json({ error: "Claims not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Claims updated successfully", claims });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
