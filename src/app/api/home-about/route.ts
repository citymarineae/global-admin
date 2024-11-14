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
  console.log("Id", id)
  if (!id) {
    return NextResponse.json({ error: "Missing home about ID" }, { status: 400 });
  }
  await dbConnect();

  try {
    const formData = await req.formData();
    const updatedData = Object.fromEntries(formData);

    // Check if a new image is provided
    const newImage = formData.get("image") as File | null;
    const videoPoster1 = formData.get("videoPoster1") as File | null;
    const videoPoster2 = formData.get("videoPoster2") as File | null;

    console.log(newImage)
    console.log(videoPoster1)
    console.log(videoPoster2)

    if (newImage && newImage instanceof File) {

      console.log("HERE am u")
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
      console.log("HERE I uiiuiuiu")
      // If no new image is provided, remove the image field from updatedData
      // to prevent overwriting the existing image path with null
      delete updatedData.image;
    }

    if (videoPoster1 && videoPoster1 instanceof File && videoPoster2 && videoPoster2 instanceof File) {
      try {
        const videoPoster1FileName = `${Date.now()}-${videoPoster1.name || "image"}`;
        const dropboxPathPoster1 = `/home-about-videoposter/${videoPoster1FileName}`;

        const videoPoster2FileName = `${Date.now()}-${videoPoster2.name || "image"}`;
        const dropboxPathPoster2 = `/home-about-videoposter/${videoPoster2FileName}`;

        const videoPoster1Path = await uploadToDropbox(videoPoster1, dropboxPathPoster1)
        const videoPoster2Path = await uploadToDropbox(videoPoster2, dropboxPathPoster2)

        updatedData.videoPoster1 = videoPoster1Path
        updatedData.videoPoster2 = videoPoster2Path

      } catch (error) {
        console.error("Error uploading video banner to Dropbox:", error);
        return NextResponse.json({ error: "Error uploading new image" }, { status: 500 });
      }
    }else{
      delete updatedData.videoPoster1
      delete updatedData.videoPoster2
    }

    const homeAbout = await HomeAbout.findByIdAndUpdate(id, updatedData, { new: true });
    if (!homeAbout) {
      return NextResponse.json({ error: "Home About not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Home About updated successfully" });
  } catch (error) {
    console.error("Error updating home about:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}