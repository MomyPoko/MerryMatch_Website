import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (filePath: File, folder: string) => {
  try {
    const buffer = await filePath.arrayBuffer();
    const byte = Buffer.from(buffer);

    return new Promise<{ url: string; publicId: string }>(
      async (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "auto", folder: folder },
            async (err, result) => {
              if (err) {
                return reject(err.message); // ตรวจสอบว่ามีข้อผิดพลาดหรือไม่
              }
              if (!result) {
                return reject("Upload failed, no result from Cloudinary.");
              }
              return resolve({
                url: result.secure_url || "",
                publicId: result.public_id || "",
              });
            }
          )
          .end(byte); // ส่งข้อมูลไปยัง Cloudinary
      }
    );
  } catch (error) {
    console.error("Error during file upload:", error);
    throw new Error(`File upload failed: ${error}`);
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  return new Promise<void>((resolve, reject) => {
    if (!publicId) {
      console.error("Invalid publicId:", publicId);
      return reject("Invalid publicId");
    }

    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Error deleting image:", error);
        return reject(error);
      }
      console.log("Cloudinary delete result:", result);
      resolve();
    });
  });
};
