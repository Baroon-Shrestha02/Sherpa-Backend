const cloudinary = require("cloudinary").v2;

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// ✅ Allowed MIME Types (Images + Videos)
const allowedExtensions = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/mov",
  "video/avi",
  "video/mkv",
  "video/MTS",
];

const uploadImages = async (files) => {
  const fileArray = Array.isArray(files) ? files : [files];
  const isSingleFile = fileArray.length === 1;

  const uploadedFiles = [];

  for (const file of fileArray) {
    if (!allowedExtensions.includes(file.mimetype)) {
      throw new Error("Invalid file type");
    }

    try {
      const resourceType = file.mimetype.startsWith("video") ? "video" : "image";

      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: resourceType, // ✅ allows both image & video
        // upload_preset: "your_preset_name", // Optional
      });

      if (!result || result.error) {
        throw new Error("Error uploading the file");
      }

      uploadedFiles.push({
        public_id: result.public_id,
        url: result.secure_url,
        resource_type: result.resource_type,
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error.message);
      throw new Error("An error occurred while uploading files");
    }
  }

  return isSingleFile ? uploadedFiles[0] : uploadedFiles;
};

const deleteCloudinaryFiles = async (files = []) => {
  for (const file of files) {
    try {
      await cloudinary.uploader.destroy(file.public_id, {
        resource_type: file.resource_type || "image", // ✅ delete video/image accordingly
      });
    } catch (err) {
      console.warn(`Failed to delete Cloudinary file: ${file.public_id}`);
    }
  }
};

module.exports = { uploadImages, deleteCloudinaryFiles };
