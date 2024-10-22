import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { writeFile } from "fs/promises";
import path from "path";
import Team from "@/models/Team";

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

    if (!name || !position || !description || !phone || !email || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imagePath = "";

    if (image && image instanceof Blob) {
      // Handle image upload
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a unique filename
      const filename = `${Date.now()}-${image.name || "image"}`;
      imagePath = path.join(process.cwd(), "public", "images", "team", filename);

      // Save the file
      await writeFile(imagePath, buffer);
      imagePath = `/images/team/${filename}`; // Save the relative path
    } else {
      console.log("No valid image file received");
    }

    // Save to database
    const team = new Team({
      name,
      position,
      description,
      phone,
      email,
      image: imagePath,
    });

    await team.save();

    return NextResponse.json({ message: "Team member added successfully", team }, { status: 201 });
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

    if (id) {
      // Fetch a single news item by ID
      const team = await Team.findById(id);
      if (!team) {
        return NextResponse.json({ error: "Team member not found" }, { status: 404 });
      }
      return NextResponse.json(team);
    } else {
      // Fetch all news items
      const members = await Team.find().sort({ date: -1 }); // Sort by date, newest first
      return NextResponse.json(members);
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

    const member = await Team.findByIdAndUpdate(id, updatedData, { new: true });
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Member updated successfully", member });
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
