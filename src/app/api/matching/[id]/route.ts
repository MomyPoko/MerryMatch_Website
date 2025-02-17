import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

interface UpdateMatchingRequest {
  targetUserId: string;
  status: "pending" | "matched" | "rejected";
}

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectMongoDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const currentUserId = session.user.id;
    const { targetUserId, status }: UpdateMatchingRequest = await req.json();

    console.log("🔥 API PUT /api/matching/[id] called!");
    console.log("Params ID:", params.id);
    console.log("Current User ID:", currentUserId);
    console.log("Target User ID:", targetUserId);
    console.log("Status:", status);

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    console.log("Check currentuser: ", currentUser);

    if (!currentUser || !targetUser) {
      return NextResponse.json(
        { message: "currentUser or targetUser not found" },
        { status: 404 }
      );
    }

    const currentUserMatchIndex = currentUser.matching.findIndex(
      (match: any) => match.userId.toString() === targetUserId
    );

    if (currentUserMatchIndex === -1) {
      return NextResponse.json(
        { message: "Match not found for requester" },
        { status: 404 }
      );
    }

    currentUser.matching[currentUserMatchIndex].status = status;
    await currentUser.save();

    const targetUserMatchIndex = targetUser.matching.findIndex(
      (match: any) => match.userId.toString() === currentUserId
    );

    if (targetUserMatchIndex === -1) {
      return NextResponse.json(
        { message: "Match not found for receiver" },
        { status: 404 }
      );
    }

    targetUser.matching[targetUserMatchIndex].status = status;
    await targetUser.save();

    return NextResponse.json(
      { message: "Matching status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating matching status: ", error);
    return NextResponse.json(
      { message: "Failed to update matching status" },
      { status: 500 }
    );
  }
};
