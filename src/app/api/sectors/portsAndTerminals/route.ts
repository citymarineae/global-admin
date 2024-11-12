import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { uploadToDropbox } from "@/lib/connectDropbox";
import PortsAndTerminals from "@/models/PortsAndTerminals";
import { formatDbResponse } from "@/lib/formatDbResponse";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const imageOne = formData.get("imageOne") as File | null;
    const imageTwo = formData.get("imageTwo") as File | null;
    const contentOne = formData.get("contentOne") as string;
    const contentTwo = formData.get("contentTwo") as string;
    const metaDataTitle = formData.get("metaDataTitle") as string;
    const metaDataDesc = formData.get("metaDataDesc") as string;
    const altTagImageOne = formData.get("altTagImageOne") as string;
    const altTagImageTwo = formData.get("altTagImageTwo") as string;

    if (!title || !contentOne || !contentTwo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Function to handle image upload
    const uploadImage = async (image: File | null, prefix: string, existingPath: string) => {
      if (image instanceof File) {
        try {
          const filename = `${Date.now()}-${prefix}-${image.name || "image"}`;
          const dropboxPath = `/portsAndTerminals/${filename}`;
          const imagePath = await uploadToDropbox(image, dropboxPath);
          console.log(`${prefix} uploaded to Dropbox:`, imagePath);
          return imagePath;
        } catch (error) {
          console.error(`Error uploading ${prefix} to Dropbox:`, error);
          throw new Error(`Error uploading ${prefix}`);
        }
      } else {
        return existingPath; // Return the existing image path if no new image is provided
      }
    };

    // Fetch the existing document
    const existingDoc = await PortsAndTerminals.findOne();

    // Upload or get paths for both images
    const imageOnePath = await uploadImage(imageOne, "imageOne", existingDoc?.imageOne || "");
    const imageTwoPath = await uploadImage(imageTwo, "imageTwo", existingDoc?.imageTwo || "");

    // Upsert the portsAndTerminals document
    const portsAndTerminals = await PortsAndTerminals.findOneAndUpdate(
      {}, // empty filter to match any document
      {
        title,
        contentOne,
        contentTwo,
        imageOne: imageOnePath,
        imageTwo: imageTwoPath,
        metaDataTitle,
        metaDataDesc,
        altTagImageOne,
        altTagImageTwo
      },
      {
        new: true, // return the updated document
        upsert: true, // create a new document if one doesn't exist
        setDefaultsOnInsert: true, // if a new document is created, ensure default values are set
      }
    );

    return NextResponse.json(
      {
        message: "Ports and Terminals data updated successfully",
        portsAndTerminals: formatDbResponse(portsAndTerminals),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Ports and Terminals data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const portsAndTerminals = await PortsAndTerminals.findOne();
    if (!portsAndTerminals) {
      return NextResponse.json({ error: "Ports and Terminals not found" }, { status: 404 });
    }
    return NextResponse.json(formatDbResponse(portsAndTerminals));
  } catch (error) {
    console.error("Error fetching ports and terminals:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
