import User from "@/models/user";
import mongoose from "mongoose";
import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import "dotenv/config";

mongoose.set("strictPopulate", false);

interface IUser {
  _id: string;
  username: string;
  sexIdent?: string;
  dateOfBirth?: Date;
  matching: IMatching[];
}

interface IMatching {
  userId: string;
  username: string;
  status: "pending" | "matched" | "rejected";
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

    const currentUserId: string = session.user.id;

    const { searchParams } = new URL(req.url);

    const sexIdent: string | null = searchParams.get("sexIdent");

    const minAge: number | null = searchParams.get("minAge")
      ? parseInt(searchParams.get("minAge") || "0", 10)
      : null;

    const maxAge: number | null = searchParams.get("maxAge")
      ? parseInt(searchParams.get("maxAge") || "0", 10)
      : null;

    const fetchMatches: boolean = searchParams.get("fetchMatches") === "true";

    const currentUser: IUser | null = await User.findById(
      currentUserId
    ).populate({
      path: "matching.userId",
      model: "User", // เชื่อมกับ model 'User'
    });

    if (!currentUser) {
      return NextResponse.json(
        { message: "Current user not found" },
        { status: 404 }
      );
    }

    const query: any = {
      _id: { $ne: currentUserId },
    };

    if (sexIdent) query.sexIdent = { $in: sexIdent.split(",") };

    if (minAge !== null && maxAge !== null) {
      const today = new Date();
      const minDate = new Date(today.getFullYear() - maxAge, today.getMonth());
      const maxDate = new Date(today.getFullYear() - minAge, today.getMonth());
      query.dateOfBirth = { $gte: minDate, $lte: maxDate };
    }

    if (fetchMatches) {
      // Show matched users only
      const matchedUsers: string[] = currentUser.matching
        .filter((match: any) => match.status === "matched")
        .map((match: any) => match.userId);
      return NextResponse.json(matchedUsers, { status: 200 });
    } else {
      // Exclude users with pending/rejected/matched status
      const excludeIds: string[] = currentUser.matching
        .filter(
          (match: any) =>
            match.status !== "matched" || match.status !== "rejected"
        )
        .map((match: any) => match.userId);

      query._id = { $nin: excludeIds };
    }

    const users = await User.find(query).populate("packages").lean();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log("Error fetching users: ", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
