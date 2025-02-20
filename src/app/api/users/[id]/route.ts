import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/utils/upload_Files";
import "dotenv/config";
import mongoose from "mongoose";

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

    const userId = params.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();

    const name = formData.get("name");
    const sexPref = formData.get("sexPref");
    const racialPref = formData.get("racialPref");
    const meeting = formData.get("meeting");
    const hobbies = formData.get("hobbies");
    // const imageFiles = formData.getAll("image") as unknown as File[];

    if (name) user.name = name;
    if (sexPref) user.sexPref = sexPref;
    if (meeting) user.meeting = meeting;
    if (hobbies) user.hobbies = hobbies;
    if (racialPref) user.racialPref = racialPref;

    // ดึง URL ของรูปที่มีอยู่แล้ว
    const existingImages = formData.getAll("existingImages") as string[];
    // console.log("existingImages:", existingImages);

    const remainingImages = user.image.filter((img: any) =>
      existingImages.includes(img.url)
    );

    const deletedImages = user.image.filter(
      (img: any) => !existingImages.includes(img.url)
    );
    // console.log("deletedImages:", deletedImages);

    for (const img of deletedImages) {
      if (img.publicId) {
        try {
          // console.log(`Deleting image with publicId: ${img.publicId}`);
          await deleteFromCloudinary(img.publicId);
        } catch (error) {
          console.log(`⚠️ Failed to delete image: ${img.publicId}`, error);
        }
      }
    }

    // อัปโหลดไฟล์รูปภาพใหม่
    const imageFiles = formData.getAll("image") as unknown as File[];
    // console.log("Uploading new images:", imageFiles);

    const uploadedImages: { url: string; publicId: string }[] = [];

    for (const image_data of imageFiles) {
      const uploadResult = await uploadToCloudinary(
        image_data,
        "merry-match/image-upload"
      );
      uploadedImages.push(uploadResult);
    }

    const updatedData = {
      name,
      sexPref,
      racialPref,
      meeting,
      hobbies,
      image: [...remainingImages, ...uploadedImages],
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      // console.error("Failed to update user");
      return NextResponse.json({ message: "Update failed" }, { status: 500 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    // console.log("Error updating user: ", error);
    return NextResponse.json({ message: "Can't update user" }, { status: 500 });
  }
};
