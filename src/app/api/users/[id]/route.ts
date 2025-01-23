import User from "@/models/user";
import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/utils/upload_Files";
import "dotenv/config";
import mongoose from "mongoose";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectMongoDB();
    const userId = params.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();

    const name = formData.get("name");
    const sexPref = formData.get("sexPref");
    const meeting = formData.get("meeting");
    const imageFiles = formData.getAll("image") as unknown as File[];

    if (name) user.name = name;
    if (sexPref) user.sexPref = sexPref;
    if (meeting) user.meeting = meeting;

    if (imageFiles.length > 0) {
      const uploadedImages: { url: string; publicId: string }[] = [];

      for (const image_data of imageFiles) {
        const uploadResult = await uploadToCloudinary(
          image_data,
          "merry-match/image-upload"
        );
        uploadedImages.push(uploadResult); // เก็บ URL และ Public ID ของไฟล์ที่อัปโหลดในอาร์เรย์
      }
      user.image = uploadedImages;
    }

    const updatedUser = await user.save();

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.log("Error updating user: ", error);
    return NextResponse.json({ message: "Can't update user" }, { status: 500 });
  }
};
