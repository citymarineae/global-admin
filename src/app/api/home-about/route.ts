import { uploadToDropbox } from "@/lib/connectDropbox";
import dbConnect from "@/lib/dbConnect";
import { formatDbResponse } from "@/lib/formatDbResponse";
import HomeAbout from "@/models/HomeAbout";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    // Fetch contact
    const homeabout = await HomeAbout.find();

    if (!homeabout) {
      return NextResponse.json({ error: "homeabout not found" }, { status: 404 });
    }
    return NextResponse.json({ homeabout: formatDbResponse(homeabout) });
  } catch (error) {
    console.error("Error fetching homeabout:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  console.log("Id",id)
  if (!id) {
    return NextResponse.json({ error: "Missing home about ID" }, { status: 400 });
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
        const dropboxPath = `/home-about/${filename}`;

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

    const homeAbout = await HomeAbout.findByIdAndUpdate(id, updatedData, { new: true });
    if (!homeAbout) {
      return NextResponse.json({ error: "Home About not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Home About updated successfully"});
  } catch (error) {
    console.error("Error updating home about:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}