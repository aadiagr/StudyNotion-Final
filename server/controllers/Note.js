const Note = require("../models/Note");
const Subsection = require("../models/Subsection");
const Course = require("../models/Course");
const { uploadFileToCloudinary } = require("../utils/fileUploader");

// Upload a new note for a subsection
exports.uploadNote = async (req, res) => {
  try {
    const { subsectionId, title, description, courseId } = req.body;
    const noteFile = req.files?.noteFile;

    // Get user ID from auth middleware
    const userId = req.user.id;

    // Validate inputs
    if (!subsectionId || !title || !noteFile || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if subsection exists
    const subsection = await Subsection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Upload file to Cloudinary (increased limit to 10MB for notes)
    const uploadResult = await uploadFileToCloudinary(
      noteFile,
      process.env.FOLDER_NAME + "/notes"
    );

    // Create note entry
    const note = await Note.create({
      title,
      description: description || "",
      fileUrl: uploadResult.secure_url,
      fileType: getFileType(noteFile.name),
      fileName: noteFile.name,
      fileSize: noteFile.size,
      subsection: subsectionId,
      course: courseId,
      instructor: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Note uploaded successfully",
      data: note,
    });
  } catch (error) {
    console.error("Error uploading note:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload note",
      error: error.message,
    });
  }
};

// Get all notes for a subsection
exports.getNotesBySubsection = async (req, res) => {
  try {
    const { subsectionId } = req.params;

    const notes = await Note.find({ subsection: subsectionId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};

// Get all notes for a course
exports.getNotesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const notes = await Note.find({ course: courseId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.id;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Check if user is the instructor who created the note
    if (note.instructor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this note",
      });
    }

    await Note.findByIdAndDelete(noteId);

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete note",
      error: error.message,
    });
  }
};

// Helper function to get file type
function getFileType(fileName) {
  const extension = fileName.split(".").pop().toLowerCase();
  if (["pdf"].includes(extension)) return "pdf";
  if (["doc"].includes(extension)) return "doc";
  if (["docx"].includes(extension)) return "docx";
  if (["txt"].includes(extension)) return "txt";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) return "image";
  return "txt"; // default
}
