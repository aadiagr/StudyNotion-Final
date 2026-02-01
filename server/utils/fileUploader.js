const cloudinary = require("cloudinary").v2
const fs = require("fs")

// Upload any file type to Cloudinary
exports.uploadFileToCloudinary = async (file, folder) => {
  try {
    // Determine resource type based on file type
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
    const isPdf = /\.pdf$/i.test(file.name)
    const resourceType = isImage ? "image" : "raw"

    const options = {
      folder: folder,
      resource_type: resourceType,
      // For PDFs and raw files, ensure public access
      ...(isPdf && { access_mode: "public" }),
    }

    console.log(`Uploading ${file.name} as ${resourceType}`)

    // Check if file has tempFilePath (from multer diskStorage) or is a buffer
    if (file.tempFilePath) {
      // File saved to disk by multer
      const result = await cloudinary.uploader.upload(file.tempFilePath, options)
      console.log("Upload result URL:", result.secure_url)
      // Clean up the temp file
      fs.unlinkSync(file.tempFilePath)
      return result
    } else if (file.data) {
      // File is a buffer
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          options,
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error)
              reject(error)
            } else {
              console.log("Upload result URL:", result.secure_url)
              resolve(result)
            }
          }
        )
        uploadStream.end(file.data)
      })
      return result
    } else {
      throw new Error("Invalid file format - no tempFilePath or data")
    }
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error)
    throw error
  }
}
