import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { uploadToDropbox } from "@/lib/connectDropbox";
import { formatDbResponse } from "@/lib/formatDbResponse";
import PersonalLines from "@/models/PersonalLines";

type UpdateablePersonalLinesFields = {
  title: string;
  content: string;
  image?: string;
  metaDataTitle:string;
  metaDataDesc:string;
};

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const image = formData.get("image") as File | string;
    const content = formData.get("content") as string;
    const metaDataTitle = formData.get("metaDataTitle") as string;
    const metaDataDesc = formData.get("metaDataDesc") as string;

    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imagePath = "";

    if (image instanceof File) {
      try {
        // Create a unique filename
        const filename = `${Date.now()}-${image.name || "image"}`;
        const dropboxPath = `/personalLines/${filename}`;

        // Upload to Dropbox
        imagePath = await uploadToDropbox(image, dropboxPath);

        console.log("Image uploaded to Dropbox:", imagePath);
      } catch (error) {
        console.error("Error uploading to Dropbox:", error);
        return NextResponse.json({ error: "Error uploading image" }, { status: 500 });
      }
    } else if (typeof image === "string") {
      imagePath = image; // use the provided image path
    } else {
      console.log("No valid image file received");
      // Instead of returning an error, we'll allow the update without changing the image
      imagePath = ""; // This will be ignored in the update if it's empty
    }

    // Prepare the update object
    const updateData: UpdateablePersonalLinesFields = {
      title,
      content,
      metaDataTitle,
      metaDataDesc
    };
    if (imagePath) {
      updateData.image = imagePath;
    }

    // Find and update the document, or create a new one if it doesn't exist
    const personalLines = await PersonalLines.findOneAndUpdate(
      {}, // empty filter to match any document
      updateData,
      {
        new: true, // return the updated document
        upsert: true, // create a new document if one doesn't exist
        setDefaultsOnInsert: true, // if a new document is created, ensure default values are set
      }
    );

    return NextResponse.json(
      { message: "Personal Lines content updated successfully", personalLines: formatDbResponse(personalLines) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Personal Lines data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const personalLines = await PersonalLines.findOne();
    if (!personalLines) {
      return NextResponse.json({ error: "Marine not found" }, { status: 404 });
    }
    return NextResponse.json(formatDbResponse(personalLines));
  } catch (error) {
    console.error("Error fetching marine:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
