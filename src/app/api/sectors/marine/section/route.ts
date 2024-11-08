import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { uploadToDropbox } from "@/lib/connectDropbox";
import MarineSection from "@/models/MarineSection";
import { formatDbResponse } from "@/lib/formatDbResponse";

export async function POST(req: NextRequest) {
  try {

    await dbConnect();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const subTitle = formData.get("subTitle") as string;
    const image = formData.get("image") as File;
    const content = formData.get("content") as string;
    const bannerVideo = formData.get("bannerVideo") as string;
    const bannerImage = formData.get("bannerImage") as File;
    const slug = formData.get("slug") as string

    console.log("Video",bannerVideo)


    if (!image || !subTitle || !title || !content || !bannerImage || !bannerVideo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imagePath = "";
    let bannerImagePath = "";
    

    if (image && image instanceof File && bannerImage && bannerImage instanceof File) {
      try {
        // Create a unique filename
        const filename = `${Date.now()}-${image.name || "image"}`;
        const dropboxPath = `/marineSection/${filename}`;
        const bannerImageName = `${Date.now()}-${bannerImage.name || "bannerImage"}`;
        const bannerDropboxPath = `/marineSectionBanner/${bannerImageName}`;

        // Upload to Dropbox
        imagePath = await uploadToDropbox(image, dropboxPath);
        bannerImagePath = await uploadToDropbox(bannerImage, bannerDropboxPath);
        

        console.log("Image uploaded to Dropbox:", imagePath);
        console.log("Banner uploaded to Dropbox:", bannerDropboxPath);
        

      } catch (error) {
        console.error("Error uploading to Dropbox:", error);
        return NextResponse.json({ error: "Error uploading image" }, { status: 500 });
      }
    } else if (image && typeof image === "string" && bannerImage && typeof bannerImage === "string" && bannerImage && typeof bannerVideo === "string") {
      // do nothing
      imagePath = image;
      bannerImagePath = bannerImage; // use the provided image path
    } else {
      console.log("No valid image file received");
      return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
    }



    // Save to database
    const marine = new MarineSection({
      title,
      content,
      subTitle,
      image: imagePath,
      bannerVideo,
      bannerImage: bannerImagePath,
      slug
    });

    await marine.save();

    return NextResponse.json(
      { message: "Marine Section data updated successfully", marine: formatDbResponse(marine) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating Marine section data:", error);
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
      const marineSections = await MarineSection.findById(id);
      if (!marineSections) {
        return NextResponse.json({ error: "Marine Section not found",id }, { status: 404 });
      }
      return NextResponse.json(formatDbResponse(marineSections));
    }else if(slug){
      const marineSections = await MarineSection.findOne({slug});
      if (!marineSections) {
        return NextResponse.json({ error: "Marine Section not found",id }, { status: 404 });
      }
      return NextResponse.json(formatDbResponse(marineSections));
    } else {
      // Fetch all news items
      const marineSections = await MarineSection.find().sort({ date: -1 }); // Sort by date, newest first
      return NextResponse.json({ marineSections: formatDbResponse(marineSections) });
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
    return NextResponse.json({ error: "Missing marine section ID" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const updatedData = Object.fromEntries(formData);

    // Check if a new image is provided
    const newImage = formData.get("image") as File | null;
    const newBannerImage = formData.get("bannerImage") as File | null;

    if (newImage && newImage instanceof File) {
      try {
        // Create a unique filename
        const filename = `${Date.now()}-${newImage.name || "image"}`;
        const dropboxPath = `/sectorImage/${filename}`;

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

    if (newBannerImage && newBannerImage instanceof File) {
      try {
        // Create a unique filename
        const filename = `${Date.now()}-${newBannerImage.name || "image"}`;
        const dropboxPath = `/sectorsBanner/${filename}`;

        // Upload to Dropbox
        const imagePath = await uploadToDropbox(newBannerImage, dropboxPath);

        console.log("New image uploaded to Dropbox:", imagePath);

        // Update the image path in the updatedData
        updatedData.bannerImage = imagePath;
      } catch (error) {
        console.error("Error uploading new image to Dropbox:", error);
        return NextResponse.json({ error: "Error uploading new image" }, { status: 500 });
      }

    }

      // if (newBannerVideo && newBannerVideo instanceof File) {
      //   try {
      //     // Create a unique filename
      //     const filename = `${Date.now()}-${newBannerVideo.name || "bannerVideo"}`;
      //     const dropboxPath = `/sectorsBannerVideo/${filename}`;
  
      //     // Upload to Dropbox
      //     const videoPath = await uploadToDropbox(newBannerVideo, dropboxPath);
  
      //     console.log("New image uploaded to Dropbox:", videoPath);
  
      //     // Update the image path in the updatedData
      //     updatedData.bannerVideo = videoPath;
      //   } catch (error) {
      //     console.error("Error uploading new video to Dropbox:", error);
      //     return NextResponse.json({ error: "Error uploading new image" }, { status: 500 });
      //   }

    // } else {
    //   // If no new image is provided, remove the image field from updatedData
    //   // to prevent overwriting the existing image path with null
    //   delete updatedData.bannerVideo;
    // }

    const marineSection = await MarineSection.findByIdAndUpdate(id, updatedData, { new: true });

    if (!marineSection) {
      return NextResponse.json({ error: "Marine Section not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Marine Section Updated successfully", member: formatDbResponse(marineSection) });


  } catch (error) {
    console.error("Error updating marine section:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

}


export async function DELETE(req:NextRequest) {
  try {
    const {searchParams} = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing marine section ID" }, { status: 400 });
    }

    const deleteSection = await MarineSection.deleteOne({_id:id})

    if(deleteSection){
      console.log("Item removed")
      return NextResponse.json({message:"Section removed successfully"},{status:200})
    }

    return NextResponse.json({error:"Removing section failed"},{status:400})


  } catch (error) {
    console.error("Error fetching marine:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  }

