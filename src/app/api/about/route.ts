import dbConnect from "@/lib/dbConnect";
import About from "@/models/About";
import { NextRequest, NextResponse } from "next/server";
import { uploadToDropbox } from "@/lib/connectDropbox";
import { formatDbResponse } from "@/lib/formatDbResponse";



export async function GET() {
  await dbConnect();

  try {
    const about = await About.find();

    console.log(about);

    if (!about) {
      return NextResponse.json({ error: "About not found" }, { status: 404 });
    }

    return NextResponse.json({ about: formatDbResponse(about) });
  } catch (error) {
    console.log("error getting about:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const updatedData = Object.fromEntries(formData);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    console.log("ID",id)

    // console.log("UpdateData",updatedData)

    // Check if a new image is provided
    const newImage = formData.get("image") as File | null;

    

    if (newImage && newImage instanceof File) {
      try {
        // Create a unique filename
        const filename = `${Date.now()}-${newImage.name || "image"}`;
        const dropboxPath = `/news/${filename}`;

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
      // making the image to empty string if no image is present
      delete updatedData.image;
    }

    //todo - need to change this
    console.log("update data final", updatedData);
    const about = await About.findByIdAndUpdate(id, updatedData, { new: true });
    if (!about) {
      return NextResponse.json({ error: "About not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "About updated successfully" }, { status: 200 });
  } catch (error) {
    console.log("error getting about:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
