import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

interface UpdateMatchingRequest {
  requesterId: string;
  status: "pending" | "matched" | "rejected";
}

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectMongoDB();

    const { requesterId, status }: UpdateMatchingRequest = await req.json();

    const requester = await User.findById(requesterId);
    const receiver = await User.findById(params.id);

    if (!requester || !receiver) {
      return NextResponse.json(
        { message: "Requester or Receiver not found" },
        { status: 404 }
      );
    }

    const requesterMatchIndex = requester.matching.findIndex(
      (match: any) => match.userId.toString() === params.id
    );

    if (requesterMatchIndex === -1) {
      return NextResponse.json(
        { message: "Match not found for requester" },
        { status: 404 }
      );
    }

    requester.matching[requesterMatchIndex].status = status;
    await requester.save();

    const receiverMatchIndex = receiver.matching.findIndex(
      (match: any) => match.userId.toString() === requesterId
    );

    if (receiverMatchIndex === -1) {
      return NextResponse.json(
        { message: "Match not found for receiver" },
        { status: 404 }
      );
    }

    receiver.matching[receiverMatchIndex].status = status;
    await receiver.save();

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
