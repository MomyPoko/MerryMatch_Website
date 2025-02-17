import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import User from "@/models/user";
import Notification from "@/models/notification";

interface IUser {
  userId: string;
  username: string;
  status: "pending" | "matched" | "rejected";
  name: string;
  image: { url: string }[];
  matching: IMatching[];
}

interface IMatching {
  userId: string;
  username: string;
  status: "pending" | "matched" | "rejected";
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { senderId, receiverId, type, message } = await req.json();

    // ตรวจสอบ User ที่เกี่ยวข้อง
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // สร้าง Notification ใหม่
    const newNotification = await Notification.create({
      sender: senderId,
      receiver: receiverId,
      type,
      message,
    });

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create notification" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await connectMongoDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      console.error("Authentication failed: No valid session");
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const notifications = await Notification.find({ receiver: session.user.id })
      .populate("sender")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
