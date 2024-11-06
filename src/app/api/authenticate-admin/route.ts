import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData()
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const newPassword = formData.get("newPassword") as string

    if (!newPassword) {
        try {
            const admin = await User.findOne({ username })
            if (admin) {
                if (admin.password == password) {
                    return NextResponse.json({ message: "Authenticated successfully",reset:false }, { status: 200 })
                }

                return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
            }

            return NextResponse.json({ error: "Invalid Credentials" }, { status: 400 })

        } catch (error) {
            console.error("Error updating news:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    } else {
        try {
            const admin = await User.findOne({ username })
            if (admin) {
                if (admin.password == password) {
                    admin.password = newPassword
                    await admin.save()
                    return NextResponse.json({ message: "Password reset successfull",reset:true }, { status: 200 })
                }

                return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
            }

            return NextResponse.json({ error: "Invalid Credentials" }, { status: 400 })

        } catch (error) {
            console.error("Error updating news:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }


}