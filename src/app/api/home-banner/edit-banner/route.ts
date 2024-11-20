import { uploadToDropbox } from "@/lib/connectDropbox";
import dbConnect from "@/lib/dbConnect";
import { formatDbResponse } from "@/lib/formatDbResponse";
import HomeBanner from "@/models/HomeBanner";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Missing banner ID" }, { status: 400 });
    }

    await dbConnect();
  
    try {
      const formData = await req.formData();
      const updatedData = Object.fromEntries(formData);
  
      // Check if a new image is provided
      const newImage = formData.get("videoPoster") as File | null;
  
      console.log("Data",updatedData)
  
      if (newImage && newImage instanceof File) {
        try {
          // Create a unique filename
          const filename = `${Date.now()}-${newImage.name || "image"}`;
          const dropboxPath = `/home-banner/${filename}`;
  
          // Upload to Dropbox
          const imagePath = await uploadToDropbox(newImage, dropboxPath);
  
          console.log("New image uploaded to Dropbox:", imagePath);
  
          // Update the image path in the updatedData
          updatedData.videoPoster = imagePath;
        } catch (error) {
          console.error("Error uploading new image to Dropbox:", error);
          return NextResponse.json({ error: "Error uploading new image" }, { status: 500 });
        }
      } else {
        // If no new image is provided, remove the image field from updatedData
        // to prevent overwriting the existing image path with null
        delete updatedData.videoPoster;
      }
  
      const homebanner = await HomeBanner.findByIdAndUpdate(id, updatedData, { new: true });
      if (!homebanner) {
        return NextResponse.json({ error: "Home Banner not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Home Banner updated successfully", homebanner: formatDbResponse(homebanner) });
    } catch (error) {
      console.error("Error updating news:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }