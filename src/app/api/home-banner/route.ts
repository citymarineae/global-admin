import { uploadToDropbox } from "@/lib/connectDropbox";
import dbConnect from "@/lib/dbConnect";
import { formatDbResponse } from "@/lib/formatDbResponse";
import HomeBanner from "@/models/HomeBanner";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {
    const {searchParams} = new URL(req.url)
    const id = searchParams.get("id")
    
    console.log("Id",id)

    await dbConnect();
    
    let homebanner;
    
    try {
      // Fetch contact
      if(id){
        homebanner = await HomeBanner.findById({_id:id});
      }else{
        homebanner = await HomeBanner.find();
      }
      if (!homebanner) {
        return NextResponse.json({ error: "homebanner not found" }, { status: 404 });
      }
      return NextResponse.json({ homebanner: formatDbResponse(homebanner) });
    } catch (error) {
      console.error("Error fetching homebanneer:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }


export async function POST(req: NextRequest) {

    await dbConnect();
  
    try {
      const formData = await req.formData();
      const data = Object.fromEntries(formData);
        
      console.log("Data",data)
      // Check if a new image is provided
      const videoPoster = formData.get("videoPoster") as File | null;
      const title = formData.get("title") as string;
      const subTitle = formData.get("subTitle") as string;
      const bannerVideo = formData.get("bannerVideo") as string;
        
      console.log("videoPoster",videoPoster)
        let imagePath;

      if (videoPoster && videoPoster instanceof File) {
        
        try {
          // Create a unique filename
          const filename = `${Date.now()}-${videoPoster.name || "image"}`;
          const dropboxPath = `/home-banner/${filename}`;
  
  
  
          // Upload to Dropbox
          imagePath = await uploadToDropbox(videoPoster, dropboxPath);
  
  
          console.log("New image uploaded to Dropbox:", imagePath);
  
          // Update the image path in the updatedData
          
        } catch (error) {
          console.error("Error uploading new image to Dropbox:", error);
          return NextResponse.json({ error: "Error uploading new image" }, { status: 500 });
        }
      } else {
        // If no new image is provided, remove the image field from updatedData
        // to prevent overwriting the existing image path with null
        delete data.image;
      }
  
      const homeBanner = await HomeBanner.create({
        title,
        subTitle,
        videoPoster:imagePath,
        bannerVideo
      });

      if(homeBanner){
            return NextResponse.json({ message: "Home Banner updated successfully" });
      }
    } catch (error) {
      console.error("Error adding home banner:", error);
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
  
      const deleteSection = await HomeBanner.deleteOne({_id:id})
  
      if(deleteSection){
        console.log("Item removed")
        return NextResponse.json({message:"Banner removed successfully"},{status:200})
      }
  
      return NextResponse.json({error:"Removing banner failed"},{status:400})
  
  
    } catch (error) {
      console.error("Error fetching homebanner:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
    }