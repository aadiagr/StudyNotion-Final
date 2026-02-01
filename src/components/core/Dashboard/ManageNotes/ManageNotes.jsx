import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchInstructorCourses, getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI"
import { fetchNotesByCourse, uploadNote, deleteNote } from "../../../../services/operations/courseDetailsAPI"
import { VscNote, VscCloudUpload, VscTrash, VscFile, VscCheck, VscClose } from "react-icons/vsc"
import IconBtn from "../../../Common/IconBtn"

const ManageNotes = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedCourseFull, setSelectedCourseFull] = useState(null)
  const [courseNotes, setCourseNotes] = useState([])
  const [allSubsections, setAllSubsections] = useState([])
  const [loading, setLoading] = useState(false)
  const [notesLoading, setNotesLoading] = useState(false)

  // Upload form state
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFormData, setUploadFormData] = useState({
    subsectionId: "",
    title: "",
    description: "",
    noteFile: null
  })
  const [uploading, setUploading] = useState(false)

  // Fetch instructor courses on load
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      const result = await fetchInstructorCourses(token)
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    }
    fetchCourses()
  }, [token])

  // Fetch notes and full course details when course is selected
  useEffect(() => {
    if (selectedCourse) {
      const fetchCourseData = async () => {
        setNotesLoading(true)
        console.log("Fetching full course details for:", selectedCourse._id)
        // Fetch full course details to get courseContent with subsections
        const fullCourseDetails = await getFullDetailsOfCourse(selectedCourse._id, token)
        console.log("Full course details:", fullCourseDetails)
        
        // Extract subsections from the response
        let subsections = []
        if (fullCourseDetails) {
          setSelectedCourseFull(fullCourseDetails)
          const courseContent = fullCourseDetails.courseContent || fullCourseDetails.courseDetails?.courseContent || []
          if (Array.isArray(courseContent)) {
            courseContent.forEach(section => {
              if (section && section.subSection && Array.isArray(section.subSection)) {
                section.subSection.forEach(subsection => {
                  subsections.push({
                    _id: subsection._id,
                    title: subsection.title,
                    sectionName: section.sectionName || section.title || "Untitled Section"
                  })
                })
              }
            })
          }
        }
        setAllSubsections(subsections)
        console.log("Extracted subsections:", subsections)
        
        // Fetch notes
        const result = await fetchNotesByCourse(selectedCourse._id, token)
        if (result) {
          setCourseNotes(result)
        }
        setNotesLoading(false)
      }
      fetchCourseData()
    }
  }, [selectedCourse, token])

  // Get all subsections from selected course (kept for reference)
  const getAllSubsections = () => {
    return allSubsections
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadFormData({ ...uploadFormData, noteFile: file })
    }
  }

  // Handle upload note
  const handleUploadNote = async (e) => {
    e.preventDefault()
    if (!uploadFormData.subsectionId || !uploadFormData.title || !uploadFormData.noteFile) {
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("subsectionId", uploadFormData.subsectionId)
    formData.append("courseId", selectedCourse._id)
    formData.append("title", uploadFormData.title)
    formData.append("description", uploadFormData.description)
    formData.append("noteFile", uploadFormData.noteFile)

    try {
      const result = await uploadNote(formData, token)
      if (result) {
        // Refresh notes
        const updatedNotes = await fetchNotesByCourse(selectedCourse._id, token)
        if (updatedNotes) {
          setCourseNotes(updatedNotes)
        }
        // Reset form
        setUploadFormData({
          subsectionId: "",
          title: "",
          description: "",
          noteFile: null
        })
        setShowUploadModal(false)
      }
    } catch (error) {
      console.error("Error uploading note:", error)
    } finally {
      setUploading(false)
    }
  }

  // Handle delete note
  const handleDeleteNote = async (noteId) => {
    try {
      const result = await deleteNote(noteId, token)
      if (result) {
        setCourseNotes(courseNotes.filter(note => note._id !== noteId))
      }
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf": return "📄"
      case "doc": return "📝"
      case "docx": return "📝"
      case "txt": return "📃"
      case "image": return "🖼️"
      default: return "📁"
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-11/12 max-w-[1000px] py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-richblack-5">Manage Notes</h1>
          <p className="mt-2 text-richblack-400">
            Upload and manage course notes for your students
          </p>
        </div>
        {selectedCourse && (
          <IconBtn
            text="Upload Note"
            onclick={() => setShowUploadModal(true)}
            customClasses="flex items-center gap-2"
          >
            <VscCloudUpload />
          </IconBtn>
        )}
      </div>

      {/* Course Selection */}
      {!selectedCourse ? (
        <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-richblack-5">Select a Course</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => setSelectedCourse(course)}
                className="cursor-pointer rounded-lg border border-richblack-600 bg-richblack-700 p-4 transition-all hover:border-yellow-50"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-richblack-5">{course.courseName}</h3>
                    <p className="text-sm text-richblack-400">
                      {course.courseContent?.length || 0} sections
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {courses.length === 0 && (
            <p className="text-richblack-400">No courses found. Please create a course first.</p>
          )}
        </div>
      ) : (
        <div>
          {/* Back button and course info */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-richblack-300 hover:text-richblack-5"
            >
              ← Back to Courses
            </button>
          </div>

          <div className="mb-6 flex items-center gap-4 rounded-lg border border-richblack-700 bg-richblack-800 p-4">
            <img
              src={selectedCourseFull?.thumbnail || selectedCourse?.thumbnail}
              alt={selectedCourseFull?.courseName || selectedCourse?.courseName}
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-richblack-5">{selectedCourseFull?.courseName || selectedCourse?.courseName}</h2>
              <p className="text-sm text-richblack-400">
                {courseNotes.length} notes uploaded
              </p>
            </div>
          </div>

          {/* Notes List */}
          {notesLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="spinner"></div>
            </div>
          ) : courseNotes.length === 0 ? (
            <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-8 text-center">
              <VscNote className="mx-auto mb-4 text-4xl text-richblack-500" />
              <h3 className="text-lg font-semibold text-richblack-5">No Notes Uploaded</h3>
              <p className="mt-2 text-richblack-400">
                Start by uploading notes for your course sections
              </p>
              <div className="mt-4">
                <IconBtn
                  text="Upload First Note"
                  onclick={() => setShowUploadModal(true)}
                  customClasses="mx-auto"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {courseNotes.map((note) => (
                <div
                  key={note._id}
                  className="flex items-center justify-between rounded-lg border border-richblack-700 bg-richblack-800 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{getFileIcon(note.fileType)}</div>
                    <div>
                      <h3 className="font-semibold text-richblack-5">{note.title}</h3>
                      {note.description && (
                        <p className="text-sm text-richblack-400">{note.description}</p>
                      )}
                      <div className="mt-1 flex items-center gap-3 text-xs text-richblack-500">
                        <span>{note.subsection?.title || "Unknown Section"}</span>
                        <span>•</span>
                        <span>{formatFileSize(note.fileSize)}</span>
                        <span>•</span>
                        <span>{note.fileType.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-richblack-700 px-3 py-2 text-sm text-richblack-300 hover:bg-richblack-600"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="rounded-lg bg-red-800/50 px-3 py-2 text-sm text-red-200 hover:bg-red-800/70"
                    >
                      <VscTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && selectedCourse && (
        <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center bg-black/60 backdrop-blur-sm">
          <div className="w-11/12 max-w-[500px] rounded-lg border border-richblack-700 bg-richblack-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-richblack-5">Upload Note</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-richblack-400 hover:text-richblack-5"
              >
                <VscClose className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleUploadNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-richblack-25 mb-1">
                  Select Section <span className="text-red-400">*</span>
                </label>
                <select
                  value={uploadFormData.subsectionId}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, subsectionId: e.target.value })}
                  className="w-full rounded-md bg-richblack-700 px-3 py-2 text-richblack-5"
                  required
                >
                  <option value="">Select a section</option>
                  {allSubsections.length === 0 ? (
                    <option value="" disabled>No sections available</option>
                  ) : (
                    allSubsections.map((subsection) => (
                      <option key={subsection._id} value={subsection._id}>
                        {subsection.sectionName} - {subsection.title}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-richblack-25 mb-1">
                  Note Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                  placeholder="Enter note title"
                  className="w-full rounded-md bg-richblack-700 px-3 py-2 text-richblack-5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-richblack-25 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={uploadFormData.description}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                  placeholder="Enter description"
                  className="w-full rounded-md bg-richblack-700 px-3 py-2 text-richblack-5"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-richblack-25 mb-1">
                  Upload File <span className="text-red-400">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleFileChange}
                  className="w-full rounded-md bg-richblack-700 px-3 py-2 text-richblack-5"
                  required
                />
                <p className="mt-1 text-xs text-richblack-500">
                  Supported formats: PDF, DOC, DOCX, TXT, Images (Max 5MB)
                </p>
              </div>

              {uploadFormData.noteFile && (
                <div className="flex items-center gap-2 rounded-md bg-richblack-700 p-3">
                  <VscFile className="text-xl" />
                  <span className="text-sm text-richblack-300">{uploadFormData.noteFile.name}</span>
                  <span className="text-xs text-richblack-500">
                    ({formatFileSize(uploadFormData.noteFile.size)})
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-lg bg-richblack-700 px-4 py-2 text-sm text-richblack-300 hover:bg-richblack-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-100 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload Note"}
                  {!uploading && <VscCloudUpload />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageNotes
