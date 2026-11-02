import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Notes } from '../models/Notes.js';
import { asyncHandler } from '../utils/asyncHandler.js'


/*
TYPE 1 TO HANDLE ERRORS:

Because this function is an async function, JavaScript automatically wraps this throw inside a Rejected Promise.
The rejected promise is caught by your asyncHandler utility wrapper behind the scenes.
The .catch(next) line automatically converts your throw into a next(err) call, which jumps straight into your 4-argument Global Error Handler in index.js
*/
const addNote = asyncHandler(async (req, res) => {
  const { title, description, tag } = req.body;

  //2.Validate
  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "All Fields are required!!");
  }

  //here fetchuser is the middleware from which we are extracting the user_id so The userId variable inside controller must match the exact property name where your authentication middleware (i.e fetchuser) stores the decoded user payload on the req object.
  const userId = req.user?._id;

  //since to add note a user for that note must exist
  if (!userId) {
    throw new ApiError(401, "Unauthorized access. User not found.");
  }

  //only if fields name match then directly 1 time field name else mention both
  const note = await Notes.create({ title, description, tag: tag || "General", user: userId })

  // thus sends back a single object (the specific note that was just created)
  return res.status(200).json(new ApiResponse(200, note, "Note Added successfullyy!!"))
})

const getUserNotes = asyncHandler(async (req, res) => {
  //middleware to check if logged in user
  const userId = req.user?._id;

  const notes = await Notes.find({ user: userId }).populate("user");

  //An empty database request is a completely valid event, not a system failure.
  //if (!notes || notes.length === 0) {
  //throw new ApiError(404, "No notes found for this user");
  //}

  return res.status(200).json(new ApiResponse(200, notes, "Notes Sent!!"))
})

const deleteNotes = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const notes = await Notes.find({ user: userId })

  if (!notes || notes.length === 0) {
    throw new ApiError(404, "No notes found for this user");
  }

  //Imp: Only search for a document before deleting it if your application requires Mongoose Middleware Hooks (like .pre('remove') or .post('remove'))

  // it only returns a count number, not the actual data.
  const deletedNotes = await Notes.deleteMany({ user: userId });

  if (!deletedNotes || deletedNotes.deletedCount == 0) {
    throw new ApiError(400, "No notes found for this user!");
  }

  return res.status(200).json(new ApiResponse(200, null, `${deletedNotes.deletedCount}Notes  deleted!!`))

})


const deleteNoteById = asyncHandler(async (req, res) => {

  //despite in frontend in url params there :id.
  //The endpoint path parameter names must match between your backend route definition and your backend controller. 
  const { noteId } = req.params;

  // Ensure the note belongs to the logged-in user before deleting
  // FIXED: Added .toString() to force conversion into a clean text string layout

  /*
  Because your payload wraps the id inside user (user: { id: ... }),  middleware safely falls back and grabs decoded.user?.id.However, user._id from MongoDB is a special Mongoose ObjectID class instance, not a plain string. When you wrap it into a payload and sign it, JWT converts it into a plain text string representation of the ID.
  
  Because req.user from the fetchuser middleware is a full Mongoose model instance, req.user._id returns a complex Mongoose ObjectID Wrapper Class, whereas your incoming URL path parameters contain a plain JavaScript String.
  
  Thus It compares the raw ObjectID wrapper object type to the string type. Because the structural data signatures don't match, MongoDB returns null and throws your 404 Invalid id screen crash.
  
  */
  const userId = req.user?._id?.toString();
  //since findByIdAndDelete requires first argument as a raw object id thus {object} cant be passed
  const deletedNote = await Notes.findOneAndDelete({
    _id: noteId,   // 1. "Target THIS specific note ID passed from the URL path"
    user: userId
  });  // 2. "But ONLY if it belongs to the user ID extracted from the token header"

  if (!deletedNote) {
    throw new ApiError(404, "Invalid id");
  }

  return res.status(200).json(new ApiResponse(200, deletedNote, "Notes  deleted!!"))
})

const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const { title, description, tag } = req.body;

  // FIXED: Added .toString() to force conversion into a clean text string layout
  const userId = req.user?._id?.toString();

  const updatedNote = await Notes.findOneAndUpdate({ _id: noteId, user: userId }, { title, description, tag: tag || "General" }, { new: true });


  if (!updatedNote) {
    throw new ApiError(404, "Invalid id");
  }

  return res.status(200).json(new ApiResponse(200, updatedNote, "Notes updated!!"))
})


export { getUserNotes, deleteNotes, deleteNoteById, addNote, updateNote }