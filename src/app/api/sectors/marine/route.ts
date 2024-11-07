import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { uploadToDropbox } from "@/lib/connectDropbox";
import Marine from "@/models/Marine";
import { formatDbResponse } from "@/lib/formatDbResponse";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const image = formData.get("image") as File;
    const content = formData.get("content") as string;

    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imagePath = "";

    if (image && image instanceof File) {
      try {
        // Create a unique filename
        const filename = `${Date.now()}-${image.name || "image"}`;
        const dropboxPath = `/marine/${filename}`;

        // Upload to Dropbox
        imagePath = await uploadToDropbox(image, dropboxPath);

        console.log("Image uploaded to Dropbox:", imagePath);
      } catch (error) {
        console.error("Error uploading to Dropbox:", error);
        return NextResponse.json({ error: "Error uploading image" }, { status: 500 });
      }
    } else if (image && typeof image === "string") {
      imagePath = image; // use the provided image path
    } else {
      console.log("No valid image file received");
      // If no image is provided, we'll keep the existing image (if any)
      const existingMarine = await Marine.findOne();
      imagePath = existingMarine ? existingMarine.image : "";
    }

    // Upsert the marine document
    const marine = await Marine.findOneAndUpdate(
      {}, // empty filter to match any document
      {
        title,
        content,
        image: imagePath,
      },
      {
        new: true, // return the updated document
        upsert: true, // create a new document if one doesn't exist
        setDefaultsOnInsert: true, // if a new document is created, ensure default values are set
      }
    );

    return NextResponse.json(
      { message: "Marine data updated successfully", marine: formatDbResponse(marine) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Marine data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const marine = await Marine.findOne();
    if (!marine) {
      return NextResponse.json({ error: "Marine not found" }, { status: 404 });
    }
    return NextResponse.json(formatDbResponse(marine));
  } catch (error) {
    console.error("Error fetching marine:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


