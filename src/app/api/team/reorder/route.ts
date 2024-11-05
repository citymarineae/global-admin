import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Team from "@/models/Team";


export async function POST(req: NextRequest) {
    await dbConnect(); // Connect to the database
    const session = await mongoose.startSession();
    try {

        const updatedList = await req.json();
        console.log("updated list",updatedList) // Parse the list from the request
        session.startTransaction(); // Start the transaction

        // Perform the operations as part of the transaction
        try {
            await Team.deleteMany({}, { session });
            
        } catch (deleteError) {
            console.error("Error deleting Team", deleteError);
            throw deleteError; // Rethrow to trigger transaction abort
        }
        
        try {
            const insert = await Team.insertMany(updatedList, { session });
            console.log("Insert",insert)
        } catch (insertError) {
            console.error("Error inserting Team", insertError);
            throw insertError; // Rethrow to trigger transaction abort
        } // No need to wrap list in an array

        await session.commitTransaction(); // Commit the transaction
        return NextResponse.json(
            { message: "Team data updated successfully" },
            { status: 200 }
        );

    } catch (error) {
        await session.abortTransaction(); // Abort the transaction on error
        console.error("Error updating Team data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        session.endSession(); // Always end the session
    }
}