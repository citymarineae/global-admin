import dbConnect from "@/lib/dbConnect";
import { formatDbResponse } from "@/lib/formatDbResponse";
import ContactUs from "@/models/ContactUs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(){
  return NextResponse.json({message:"this is a test"},{status:200})
}


export async function GET() {
  await dbConnect();
  try {
    // Fetch contact
    const contact = await ContactUs.find();

    if (!contact) {
      return NextResponse.json({ error: "contactus not found" }, { status: 404 });
    }
    return NextResponse.json({ contact: formatDbResponse(contact) });
  } catch (error) {
    console.error("Error fetching contactus:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing contact ID" }, { status: 400 });
  }

  await dbConnect();

  try {
    const formData = await req.formData();
    const updatedData = Object.fromEntries(formData);

    const contact = await ContactUs.findByIdAndUpdate(id, updatedData, { new: true });
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Contact us updated successfully", contact });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
