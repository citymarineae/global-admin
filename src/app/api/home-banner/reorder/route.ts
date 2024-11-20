import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import HomeBanner from "@/models/HomeBanner";

export async function POST(req: NextRequest) {
    await dbConnect(); // Connect to the database
    const session = await mongoose.startSession();
    try {

        const updatedList = await req.json();
        console.log("updated list",updatedList) // Parse the list from the request
        session.startTransaction(); // Start the transaction

        // Perform the operations as part of the transaction
        try {
            await HomeBanner.deleteMany({}, { session });
            
        } catch (deleteError) {
            console.error("Error deleting banner sections:", deleteError);
            throw deleteError; // Rethrow to trigger transaction abort
        }
        
        try {
            const insert = await HomeBanner.insertMany(updatedList, { session });
            console.log("Insert",insert)
        } catch (insertError) {
            console.error("Error inserting home banner sections:", insertError);
            throw insertError; // Rethrow to trigger transaction abort
        } // No need to wrap list in an array

        await session.commitTransaction(); // Commit the transaction
        return NextResponse.json(
            { message: "Home Banner data updated successfully" },
            { status: 200 }
        );

    } catch (error) {
        await session.abortTransaction(); // Abort the transaction on error
        console.error("Error updating Home banner data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        session.endSession(); // Always end the session
    }
}