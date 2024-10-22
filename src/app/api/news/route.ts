import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import News from "@/models/News";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const brief = formData.get("brief") as string;
    const content = formData.get("content") as string;
    const date = formData.get("date") as string;
    const image = formData.get("image") as File;

    if (!title || !brief || !content || !date || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imagePath = "";

    if (image && image instanceof Blob) {
      // Handle image upload
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a unique filename
      const filename = `${Date.now()}-${image.name || "image"}`;
      imagePath = path.join(process.cwd(), "public", "images", "news", filename);

      // Save the file
      await writeFile(imagePath, buffer);
      imagePath = `/images/news/${filename}`; // Save the relative path
    } else {
      console.log("No valid image file received");
    }
    // Save to database
    const news = new News({
      title,
      brief,
      content,
      date: new Date(date),
      image: imagePath,
    });

    await news.save();

    return NextResponse.json({ message: "News created successfully", news }, { status: 201 });
  } catch (error) {
    console.error("Error creating news:", error);
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
      const news = await News.findById(id);
      if (!news) {
        return NextResponse.json({ error: "News not found" }, { status: 404 });
      }
      return NextResponse.json(news);
    } else {
      // Fetch all news items
      const news = await News.find().sort({ date: -1 }); // Sort by date, newest first
      return NextResponse.json(news);
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing news ID" }, { status: 400 });
  }
  await dbConnect();

  try {
    const formData = await req.formData();
    const updatedData = Object.fromEntries(formData);

    const news = await News.findByIdAndUpdate(id, updatedData, { new: true });
    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "News updated successfully", news });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
