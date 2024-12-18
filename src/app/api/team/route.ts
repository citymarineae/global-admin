import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { uploadToDropbox } from "@/lib/connectDropbox";
import Team from "@/models/Team";
import { formatDbResponse } from "@/lib/formatDbResponse";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const position = formData.get("position") as string;
    const description = formData.get("description") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const image = formData.get("image") as File;
    const slug = formData.get("slug") as string;
    const metaDataTitle = formData.get("metaDataTitle") as string;
    const metaDataDesc = formData.get("metaDataDesc") as string;
    const altTag = formData.get("altTag") as string;

    if (!name || !position || !description || !phone || !email || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imagePath = "";

    if (image && image instanceof File) {
      try {
        // Create a unique filename
        const filename = `${Date.now()}-${image.name || "image"}`;
        const dropboxPath = `/team/${filename}`;

        // Upload to Dropbox
        imagePath = await uploadToDropbox(image, dropboxPath);

        console.log("Image uploaded to Dropbox:", imagePath);
      } catch (error) {
        console.error("Error uploading to Dropbox:", error);
        return NextResponse.json({ error: "Error uploading image" }, { status: 500 });
      }
    } else {
      console.log("No valid image file received");
      return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
    }

    // Save to database
    const team = new Team({
      name,
      position,
      description,
      phone,
      email,
      image: imagePath,
      slug,
      metaDataTitle,
      metaDataDesc,
      altTag
    });

    await team.save();

    return NextResponse.json(
      { message: "Team member added successfully", team: formatDbResponse(team) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (id) {
      // Fetch a single news item by ID
      const team = await Team.findById(id);
      if (!team) {
        return NextResponse.json({ error: "Team member not found" }, { status: 404 });
      }
      return NextResponse.json(formatDbResponse(team));
    }else if(slug){
      const team = await Team.findOne({slug});
      if (!team) {
        return NextResponse.json({ error: "Team member not found" }, { status: 404 });
      }
      return NextResponse.json(formatDbResponse(team));
    } else { 
      // Fetch all news items
      const members = await Team.find().sort({ index:1 }); // Sort by date, newest first
      return NextResponse.json(formatDbResponse(members));
    }
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing member ID" }, { status: 400 });
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
        const dropboxPath = `/team/${filename}`;

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

    const member = await Team.findByIdAndUpdate(id, updatedData, { new: true });
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Member updated successfully", member: formatDbResponse(member) });
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req:NextRequest) {
  try {
    const {searchParams} = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing memeber ID" }, { status: 400 });
    }

    const member = await Team.deleteOne({_id:id})

    if(member){
      console.log("Item removed")
      return NextResponse.json({message:"Member removed successfully"},{status:200})
    }

    return NextResponse.json({error:"Removing member failed"},{status:400})


  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  }
