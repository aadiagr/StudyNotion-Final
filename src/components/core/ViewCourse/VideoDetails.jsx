import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../Common/IconBtn"
import { fetchNotesBySubsection, uploadNote, deleteNote } from "../../../services/operations/courseDetailsAPI"
import { VscNote, VscCloudUpload, VscTrash, VscFile } from "react-icons/vsc"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  // Notes state
  const [notes, setNotes] = useState([])
  const [showNotes, setShowNotes] = useState(false)
  const [uploadingNote, setUploadingNote] = useState(false)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteDescription, setNoteDescription] = useState("")
  const [noteFile, setNoteFile] = useState(null)

  useEffect(() => {
    ; (async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        // console.log("courseSectionData", courseSectionData)
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        // console.log("filteredData", filteredData)
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        // console.log("filteredVideoData", filteredVideoData)
        setVideoData(filteredVideoData[0])
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  // Fetch notes when subsection changes and notes panel is open
  useEffect(() => {
    if (showNotes && subSectionId) {
      fetchNotes()
    }
  }, [showNotes, subSectionId])

  // Fetch notes for current subsection
  const fetchNotes = async () => {
    try {
      const response = await fetchNotesBySubsection(subSectionId, token)
      if (response) {
        setNotes(response)
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
    }
  }

  // Handle note file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNoteFile(file)
    }
  }

  // Upload a new note
  const handleUploadNote = async (e) => {
    e.preventDefault()
    if (!noteTitle || !noteFile) {
      return
    }

    setUploadingNote(true)
    const formData = new FormData()
    formData.append("subsectionId", subSectionId)
    formData.append("courseId", courseId)
    formData.append("title", noteTitle)
    formData.append("description", noteDescription)
    formData.append("noteFile", noteFile)

    try {
      const response = await uploadNote(formData, token)
      if (response) {
        setNoteTitle("")
        setNoteDescription("")
        setNoteFile(null)
        // Reset file input
        document.getElementById("noteFileInput").value = ""
        fetchNotes()
      }
    } catch (error) {
      console.error("Error uploading note:", error)
    } finally {
      setUploadingNote(false)
    }
  }

  // Delete a note
  const handleDeleteNote = async (noteId) => {
    try {
      const response = await deleteNote(noteId, token)
      if (response) {
        fetchNotes()
      }
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSectionIndx === 0 && currentSubSectionIndx === 0) {
      return true
    } else {
      return false
    }
  }

  // go to the next video
  const goToNextVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    // console.log("no of subsections", noOfSubsections)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }

  // go to the previous video
  const goToPrevVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />
          {/* Render When Video Ends */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    // set the current time of the video to 0
                    playerRef?.current?.seek(0)
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>

      {/* Notes Section */}
      <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Course Notes</h2>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="text-sm text-yellow-50 hover:text-yellow-100"
          >
            {showNotes ? "Hide Notes" : "Show Notes"}
          </button>
        </div>

        {showNotes && (
          <div className="mt-4">
            {/* Upload Note Form (Instructor only) */}
            {user?.accountType === "Instructor" && (
              <form onSubmit={handleUploadNote} className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-richblack-25">
                    Note Title *
                  </label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Enter note title"
                    className="w-full rounded-md bg-richblack-700 px-3 py-2 text-richblack-5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-richblack-25">
                    Description (optional)
                  </label>
                  <textarea
                    value={noteDescription}
                    onChange={(e) => setNoteDescription(e.target.value)}
                    placeholder="Enter description"
                    className="w-full rounded-md bg-richblack-700 px-3 py-2 text-richblack-5"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-richblack-25">
                    Upload File (PDF, DOC, TXT, Image) *
                  </label>
                  <input
                    id="noteFileInput"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={handleFileChange}
                    className="w-full rounded-md bg-richblack-700 px-3 py-2 text-richblack-5"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploadingNote || !noteTitle || !noteFile}
                  className="bg-yellow-50 px-4 py-2 rounded-md text-black font-medium hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingNote ? "Uploading..." : "Upload Note"}
                </button>
              </form>
            )}

            {/* Notes List */}
            <div className="space-y-3">
              {notes.length === 0 ? (
                <p className="text-richblack-25">No notes available for this section.</p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note._id}
                    className="flex items-start justify-between rounded-md bg-richblack-700 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">
                        {note.fileType === "pdf" && "📄"}
                        {note.fileType === "doc" && "📝"}
                        {note.fileType === "docx" && "📝"}
                        {note.fileType === "txt" && "📃"}
                        {note.fileType === "image" && "🖼️"}
                      </div>
                      <div>
                        <h3 className="font-medium">{note.title}</h3>
                        {note.description && (
                          <p className="text-sm text-richblack-25">{note.description}</p>
                        )}
                        <p className="text-xs text-richblack-400 mt-1">
                          {formatFileSize(note.fileSize)} • {note.fileType.toUpperCase()}
                        </p>
                        <a
                          href={note.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-300 hover:text-blue-200 mt-1 inline-block"
                        >
                          Download / View
                        </a>
                      </div>
                    </div>
                    {user?.accountType === "Instructor" && (
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoDetails
// video
