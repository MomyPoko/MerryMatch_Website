import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

interface MatchingRequest {
  requesterId: string;
  receiverId: string;
  status: "pending" | "matched" | "rejected";
}

interface IUserMatch {
  userId: string;
  username: string;
  status: "pending" | "matched" | "rejected";
}

interface IUser {
  _id: string;
  username: string;
  matching: IUserMatch[];
  save: () => Promise<void>;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectMongoDB();

    const { requesterId, receiverId, status }: MatchingRequest =
      await req.json();

    if (!requesterId || !receiverId) {
      return NextResponse.json(
        { message: "requesterId and receiverId are required" },
        { status: 400 }
      );
    }

    const requester: IUser | null = await User.findById(requesterId);
    const receiver: IUser | null = await User.findById(receiverId);

    if (!requester || !receiver) {
      return NextResponse.json(
        { message: "Requester or Receiver not found" },
        { status: 404 }
      );
    }

    const existingMatchRequester = requester.matching.find(
      (match) => match.userId.toString() === receiverId
    );

    const existingMatchReceiver = receiver.matching.find(
      (match) => match.userId.toString() === requesterId
    );

    if (status === "pending") {
      if (existingMatchRequester || existingMatchReceiver) {
        return NextResponse.json(
          { message: "Matching already exists" },
          { status: 400 }
        );
      }

      requester.matching.push({
        userId: receiver._id,
        username: receiver.username,
        status: "pending",
      });

      receiver.matching.push({
        userId: requester._id,
        username: requester.username,
        status: "pending",
      });

      await requester.save();
      await receiver.save();

      return NextResponse.json(
        { message: "Matching created successfully" },
        { status: 201 }
      );
    }

    if (status === "rejected") {
      if (existingMatchRequester) {
        existingMatchRequester.status = "rejected";
      } else {
        requester.matching.push({
          userId: receiver._id,
          username: receiver.username,
          status: "rejected",
        });
      }

      if (existingMatchReceiver) {
        existingMatchReceiver.status = "rejected";
      } else {
        receiver.matching.push({
          userId: requester._id,
          username: requester.username,
          status: "rejected",
        });
      }

      await requester.save();
      await receiver.save();

      return NextResponse.json(
        { message: "Matching create rejected successfully" },
        { status: 201 }
      );
    }

    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  } catch (error) {
    console.log("Error creating matching request: ", error);
    return NextResponse.json(
      { message: "Failed to create matching request" },
      { status: 500 }
    );
  }
}
