//. Its main job is to pull the list of notes from your global context, loop through them, and pass each individual note down as a Prop into the <NoteItem />
//Step 3: The Notes.jsx component taps into the pipeInside your parent component (Notes.jsx), you use the useContext hook. This acts like a faucet that plugs into the pipe and pulls the data down:

import  { useContext, useEffect, useRef,useState } from "react"; //useRef: give ref to an element
import NoteContext from '../context/notes/noteContext.jsx'
import NoteItem from '../components/NoteItem.jsx'
import AddNote from "../components/AddNote.jsx";
import { useNavigate } from 'react-router-dom';


export const NotesDashboard = (props) => {
  const context = useContext(NoteContext);
  // 1. Pull down the live 'notes' array and the 'getNotes' trigger function
  const { notes, getNotes, editNote, delNote } = context;
  const navigate = useNavigate();
    //const {token} = navigate.state.token; no need since local storage has the token saved


//useEffect: This hook runs automatically when this dashboard page first mounts onto the browser screen
  useEffect(() => {
//getNotes(): This triggers a fetch request to pull your notes from the backend database so they can be loaded into your global notes state array
 // Safety redirect: Send user to login if no token is found in browser RAM 
if(localStorage.getItem('token'))
    {
      getNotes();
    }  
  else //user not yet loged in so redirect user to login page
  {
    navigate("/login");
  }
    // eslint-disable-next-line
  }, []);

  //useRef: This acts like a digital lasso. It lets JavaScript directly touch and control a specific HTML element on the page without requiring a user to manually click it.
const ref=useRef(null)    //1. This creates an empty hook pointer line
const refClose=useRef(null)

// 2. Delete Confirmation Hook Pointers & State Workspace
const refDelete = useRef(null);
const refDeleteClose = useRef(null);
const [noteToDelete, setNoteToDelete] = useState(null);

// 1. THE STATE WORKSPACE: Holds the data while the user edits it inside the modal form
const[enote,setENote]=useState({id: "", title: "", description:"", tag:"General"})
const [filterTag, setFilterTag] = useState("All");
const [searchQuery, setSearchQuery] = useState("");
const [sortBy, setSortBy] = useState("newest");
const [updating, setUpdating] = useState(false);
const [deleting, setDeleting] = useState(false);

   /* const handleClick=(e)=>{
    e.preventDefault();//to prevent reloading of page
     // Safety check: Don't allow empty title or description submissions
    if (enote.title.trim() === "" || enote.description.trim() === "") {
      alert("Please fill in both the Title and Description");
      return;
    }

    addNote(enote.title,enote.description,enote.tag);
    // Clear out the input fields after successful addition
    setENote({ title: "", description: "", tag: "General" });
  }
*/
  const onChange=(e)=>{
    setENote({...enote,[e.target.name]:e.target.value})
  }


/*
1. updateNote (The Local UI Controller) :
Where does it live? Inside your visual Notes.js component file.
When is it used? The exact microsecond a user clicks the Edit Icon on an individual note card on the dashboard.
What is its purpose? It controls the browser interface. It does not talk to MongoDB. Its job is to pop open the hidden Bootstrap edit modal and pre-fill the form inputs with the text of the note that was clicked
How it's triggered: Passed down as a property attribute (Prop) to <NoteItem /> and fired via its Edit button click event.


2. editNote (The Remote Database Worker) :
Where does it live? Inside your global data state store NoteState.js context file.
When is it used? Much later, after the user has finished typing their corrections inside the popup window and clicks the blue primary "Update Note" submit button.
What is its purpose? It controls your data network layer. It executes an asynchronous backend network transaction (PUT request) using fetch() to modify and save that entry permanently inside your MongoDB database atlas.
How it's triggered: Destructured out of context and executed at the very end of your local handleUpdateClick submit processing sequence.

*/


{/*Step 2: The User Types the Changes */}
// 2. THE MODAL OPENER: Runs the microsecond you click "Edit" on a note card
  const updateNote = (currentNote) => {


    if (
  typeof title !== 'string' ||
  typeof description !== 'string' ||
  (tag !== undefined && typeof tag !== 'string')
) {
  throw new ApiError(400, "Invalid note data");
}

if (!title.trim() || !description.trim()) {
  throw new ApiError(400, "Valid title and description are required");
}
    //A. Open the Bootstrap modal by clicking the hidden trigger button
    ref.current.click(); //Act exactly as if the user just moved their mouse cursor over this specific button and clicked 
// B. Fill the modal form fields with the clicked note's existing text from MongoDB    
    setENote({id: currentNote._id, title: currentNote.title, description: currentNote.description, tag: currentNote.tag })
  };


// 3. THE DATABASE SAVER: Runs much later when you click "Update Note" inside the modal  
// 5. Create the handle for the "Update Note" submit button
const handleUpdateClick = async (e) => {
    e.preventDefault();

 // Client validation check
    if (enote.title.trim().length < 3 || enote.description.trim().length < 5) {
      props.showAlert("Title must be 3+ characters and Description 5+ characters", "danger");
      return;
    }

  setUpdating(true);
  try {
  // Call your editNote context function (make sure editNote is extracted from context at the top)
    const updated = await editNote(enote.id, enote.title, enote.description, enote.tag);
    if (updated) {
      props.showAlert("Updated Successfully","success");
      refClose.current.click(); // Close the modal only when the update really succeeded
    } else {
      props.showAlert("Failed to update note. Please try again.","danger");
    }
// C. Clean up: Close the modal programmatically   
  // Optional: Click the close button or ref to shut the modal after saving
    
  } catch (error) {
    console.error("Error updating note:", error);
  } finally {
    setUpdating(false);
  }
}

// 4. THE DELETE CONFIRMATION OPENER: Opens the delete confirmation modal
const confirmDelete = (currentNote) => {
  setNoteToDelete(currentNote);
  refDelete.current.click(); // Tells the crane arm pointer to click the hidden delete trigger button
};

// 5. THE DELETE EXECUTOR: Executes when the user clicks 'Delete Note' inside the confirmation modal
const handleDeleteConfirm = async () => {
  if (noteToDelete) {
    setDeleting(true);
    try {
      console.log("item deleted");
      console.log(noteToDelete._id);
      const deleted = await delNote(noteToDelete._id);
      if (deleted) {
      props.showAlert("Note Deleted Successfully", "success");
      refDeleteClose.current.click(); // Programmatically closes the delete modal
      setNoteToDelete(null);
      } else {
        props.showAlert("Failed to delete note. Please try again.", "danger");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setDeleting(false);
    }
  }
};

// Simple filter & sort logic: filter notes by tag & search query, then sort
const displayNotes = Array.isArray(notes)
  ? notes
      .filter((note) => {
        // 1. Tag matching check (if 'All', accept everything; otherwise check note tag)
        const matchesTag =
          filterTag === "All" ||
          (note.tag && note.tag.toLowerCase() === filterTag.toLowerCase());

        // 2. Search query check (search inside title OR description, case-insensitive)
        const matchesSearch =
          (note.title && note.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (note.description && note.description.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesTag && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return new Date(a.date || a.createdAt || 0) - new Date(b.date || b.createdAt || 0);
        } else if (sortBy === "title") {
          return (a.title || "").localeCompare(b.title || "");
        } else {
          // Default: "newest" first
          return new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0);
        }
      })
  : [];

{/*In React layout blocks (inside return), JavaScript commands like .map() and logical triggers like && are invisible to the engine unless they are wrapped inside curly braces {} */}
//A modal (also known as a popup or dialog box) is a graphical user interface element that sits on top of the main application screen
  return (
    <>
    <AddNote showAlert={props.showAlert} />

      {/* Hidden button used by the 'ref' hook to launch the Bootstrap modal */} 
{/*2. By writing ref={ref}, you are sticking a tracking chip onto this specific button!*/}
      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal"> Edit Note</button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
        <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
{/*modal-header: Holds the title ("Edit Note") and the tiny X close button in the top right corner. */}
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel"><span>✏️</span> Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
{/*modal-body: The middle section that houses your actual HTML <form> with the text fields, descriptions, and tags */}
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label"> Text </label>
                  <input type="text" className="form-control"  id="etitle" value={enote.title} name="title"  aria-describedby="emailHelp" onChange={onChange} />
                  <div className="form-text d-flex justify-content-between mt-1">
                    <span className={enote.title.trim().length >= 3 ? "text-success fw-medium" : "text-muted"}>
                      {enote.title.trim().length >= 3 ? "✓ Title is valid" : "Must be at least 3 characters"}
                    </span>
                    <span className="text-muted small">{enote.title.length} / 3+</span>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">  Description</label>
                  <input type="text" className="form-control" name="description" value={enote.description}  id="edescription" onChange={onChange} />
                  <div className="form-text d-flex justify-content-between mt-1">
                    <span className={enote.description.trim().length >= 5 ? "text-success fw-medium" : "text-muted"}>
                      {enote.description.trim().length >= 5 ? "✓ Description is valid" : "Must be at least 5 characters"}
                    </span>
                    <span className="text-muted small">{enote.description.length} / 5+</span>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label"> Tag</label>
                  <select className="form-select form-control" value={enote.tag} name="tag" id="etag" onChange={onChange}>
                    <option value="General">General</option>
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Study">Study</option>
                    <option value="Ideas">Ideas</option>
                    <option value="Important">Important</option>
                    {!["General", "Personal", "Work", "Study", "Ideas", "Important"].includes(enote.tag) && enote.tag && (
                      <option value={enote.tag}>{enote.tag}</option>
                    )}
                  </select>
                </div>
              </form>
            </div>
{/*modal-footer: The bottom row that holds your action buttons ("Close" and "Update Note") */} 
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary"  data-bs-dismiss="modal" > Close </button>
              <button disabled={updating || enote.title.trim().length < 3 || enote.description.trim().length < 5} type="button" className="btn btn-primary" onClick={handleUpdateClick}>
                {updating ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </span>
                ) : (
                  "Update Note"
                )}
              </button>
{/*Only when you are completely finished typing and you physically click the "Update" button at the bottom of that modal form, does the app finally execute the global context function! */}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden button used by the 'refDelete' hook to launch the Delete Confirmation modal */}
      <button ref={refDelete} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete Note</button>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 text-danger" id="deleteModalLabel">
                <span>🗑️</span> Delete Note
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body py-4">
              <p className="mb-2">Are you sure you want to permanently delete this note?</p>
              {noteToDelete && (
                <div className="p-3 bg-light rounded-3 border">
                  <div className="fw-bold text-dark">{noteToDelete.title}</div>
                  <div className="text-muted small text-truncate">{noteToDelete.description}</div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button ref={refDeleteClose} type="button" className="btn btn-secondary px-3" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-danger px-3" onClick={handleDeleteConfirm} disabled={deleting}>
                {deleting ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Deleting...
                  </span>
                ) : (
                  "Delete Note"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* FIXED: Rebuilt your notes list array mapping loop that was broken off */}
      <div className="row my-4" >
        <div className="dashboard-heading-row col-12 d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: '1.4rem' }}>📚</span>
            <h2 className="m-0 fw-bold fs-3">Your Notes</h2>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="filterTagSelect" className="text-muted small fw-semibold m-0">Tag:</label>
              <select
                id="filterTagSelect"
                className="form-select form-select-sm"
                style={{ width: 'auto', minWidth: '120px', borderRadius: '8px' }}
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
              >
                <option value="All">All Notes</option>
                <option value="General">General</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Ideas">Ideas</option>
                <option value="Important">Important</option>
              </select>
            </div>
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="sortBySelect" className="text-muted small fw-semibold m-0">Sort:</label>
              <select
                id="sortBySelect"
                className="form-select form-select-sm"
                style={{ width: 'auto', minWidth: '135px', borderRadius: '8px' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">🕒 Newest First</option>
                <option value="oldest">⏳ Oldest First</option>
                <option value="title">🔤 Title (A - Z)</option>
              </select>
            </div>
            <span className="notes-count-badge">
              {displayNotes.length} {displayNotes.length === 1 ? 'Note' : 'Notes'}
            </span>
          </div>
        </div>

        {/* Real-time Keyword Search Bar */}
        <div className="col-12 mb-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted" id="search-addon" style={{ borderRadius: '10px 0 0 10px' }}>
              🔍
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-1"
              placeholder="Search notes by title or description..."
              aria-label="Search"
              aria-describedby="search-addon"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: searchQuery ? '0' : '0 10px 10px 0' }}
            />
            {searchQuery && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                style={{ borderRadius: '0 10px 10px 0' }}
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Tag Filter Pills */}
        <div className="col-12 mb-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            {["All", "General", "Personal", "Work", "Study", "Ideas", "Important"].map((tag) => (
              <button
                key={tag}
                type="button"
                className={`btn btn-sm ${filterTag === tag ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ borderRadius: '20px', padding: '4px 14px', fontSize: '0.825rem', transition: 'all 0.2s ease' }}
                onClick={() => setFilterTag(tag)}
              >
                {tag === 'All' ? '🌟 All Notes' : tag}
              </button>
            ))}
          </div>
        </div>

        <div className="col-12">
          {notes && notes.length === 0 && (
            <div className="empty-state-card">
              <div className="empty-state-icon">📋</div>
              <h5 className="fw-bold mb-1">No notes to display</h5>
              <p className="empty-state-text mb-0">No notes to display. Add your first note above!</p>
            </div>
          )}

          {notes && notes.length > 0 && displayNotes.length === 0 && (
            <div className="empty-state-card">
              <div className="empty-state-icon">🔍</div>
              <h5 className="fw-bold mb-1">No notes found</h5>
              <p className="empty-state-text mb-2">
                {searchQuery && filterTag !== "All"
                  ? `No notes matching "${searchQuery}" with tag "${filterTag}".`
                  : searchQuery
                  ? `No notes matching "${searchQuery}".`
                  : `No notes found for tag "${filterTag}".`}
              </p>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  setFilterTag("All");
                  setSearchQuery("");
                }}
              >
                Reset Search & Filter
              </button>
            </div>
          )}
        </div>
{/*Wrapped your notes.map in curly braces {} so React reads it as code, not text */}
        {Array.isArray(displayNotes) && displayNotes.map((note) => {
           // Every single 'note' object inside this loop already has an '_id' 
        // because MongoDB automatically generates it when you ran Notes.create() on the backend!
          return (
              <NoteItem key={note._id} updateNote={updateNote} confirmDelete={confirmDelete} note={note} showAlert={props.showAlert} />);
        })}
      </div>

    </>
  );
};
/*The .map() function is a native JavaScript tool that takes an existing array, loops through every single item inside it one by one, and transforms it into something else. 
In React, it transforms raw data objects into visible visual building blocks (HTML/JSX).If your database contains 3 note objects, .map() will automatically execute exactly 3 times.
During each loop, the current item is temporarily named note. Think of it working like this:
Loop #1: Grabs the first note object from the database → assigns it to the variable note → passes it down to <NoteItem />. 

When your code says return <NoteItem />, it means JavaScript is generating a visual UI building block for that specific note and collecting it into a list.Think of .map() like a factory assembly line. Your database gives it raw materials (data objects), and the loop processes them one by one to build individual cars (the visual cards) to put into a parking lot (your screen).

1. It turns raw database data into HTML
When <NoteItem note={note} /> is returned, React takes that raw text, pushes it through your NoteItem file, and transforms it into structured HTML layouts (like a Bootstrap Card):

2. It collects them into a list array
Because .map() runs in a loop, it doesn't just display one item instantly. It creates a brand-new array behind the scenes filled with these generated UI blocks.

3. It injects the final list into the web page




note={note}: This is the Prop. You are creating a custom HTML-like attribute named note on the <NoteItem /> component, and assigning it the value of the current note object.
key={note._id}: React requires a unique identifier when looping to keep track of items efficiently. You pass the database ID (_id) as a prop here
updateNote={updateNote}: You are also passing down the updateNote function as a prop so that when you click edit inside <NoteItem />, it can signal back to this main page to open up your edit modal form




User Clicks "Update Note" in UI] 
       │
       ▼
[Notes.js] calls the `editNote()` function 
       │
       ▼
[NoteState.js] sends a PUT request to your Backend API 
       │
       ▼[MongoDB Database] updates the document and sends back a success response
       │
       ▼
[NoteState.js] updates its local React state array
       │
       ▼
[Notes.js] detects the state change, runs .map(), and instantly re-renders the screen
 */
