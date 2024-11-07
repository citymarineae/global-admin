import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import News from "@/models/News";
import { uploadToDropbox } from "@/lib/connectDropbox";
import { formatDbResponse } from "@/lib/formatDbResponse";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const brief = formData.get("brief") as string;
    const content = formData.get("content") as string;
    const date = formData.get("date") as string;
    const image = formData.get("image") as File;
    const slug = formData.get("slug") as string;

    if (!title || !brief || !content || !date || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }


    let imagePath = "";
    if (image && image instanceof File) {
      try {
        // Create a unique filename
        const filename = `${Date.now()}-${image.name || "image"}`;
        const dropboxPath = `/news/${filename}`;

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
    const news = new News({
      title,
      brief,
      content,
      date: new Date(date),
      image: imagePath,
      slug
    });

    await news.save();

    return NextResponse.json({ message: "News created successfully", news: formatDbResponse(news) }, { status: 201 });
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
    const limit = parseInt(searchParams.get("limit") || "")
    const slug = searchParams.get("slug");

    console.log("Limit",limit)
    if (id) {
      // Fetch a single news item by ID
      const news = await News.findById(id);
      if (!news) {
        return NextResponse.json({ error: "News not found" }, { status: 404 });
      }
      return NextResponse.json(formatDbResponse(news));

    }else if(!isNaN(limit)){
      
      const news = await News.find().sort({ date: -1 }).limit(limit); // Sort by date, newest first
      return NextResponse.json({ news: formatDbResponse(news) });
    
    }else if(slug){
      const news = await News.findOne({slug});
      if (!news) {
        return NextResponse.json({ error: "News not found" }, { status: 404 });
      }
      return NextResponse.json(formatDbResponse(news));
    }else {
      // Fetch all news items
      const news = await News.find().sort({ date: -1 }); // Sort by date, newest first
      return NextResponse.json({ news: formatDbResponse(news) });
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

    // Check if a new image is provided
    const newImage = formData.get("image") as File | null;

    console.log("Data",updatedData)

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
      delete updatedData.image;
    }

    const news = await News.findByIdAndUpdate(id, updatedData, { new: true });
    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "News updated successfully", news: formatDbResponse(news) });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(req:NextRequest) {
  try {
    const {searchParams} = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing news ID" }, { status: 400 });
    }

    const deleteSection = await News.deleteOne({_id:id})

    if(deleteSection){
      console.log("Item removed")
      return NextResponse.json({message:"News removed successfully"},{status:200})
    }

    return NextResponse.json({error:"Removing news failed"},{status:400})


  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  }
