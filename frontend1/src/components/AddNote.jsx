import {useContext, useState} from "react";
import NoteContext from '../context/notes/noteContext.jsx'

const AddNote = (props) => {
  const context=useContext(NoteContext);
  const {addNote}=context;//Reaches inside that global store and pulls out only the addNote function. This function knows how to save things to your database

  const[note,setNote]=useState({title: "", description:"", tag:"General"})
  //setNote: The only function allowed to change the data inside note
  const [loading, setLoading] = useState(false);

  const handleClick= async (e)=>{
    e.preventDefault();//to prevent reloading of page

    // DEPLOYMENT FIX: Validate the actual note state.
    // The previous block referenced title/description/tag variables
    // that were not defined inside this component.
    if (
      typeof note.title !== 'string' ||
      typeof note.description !== 'string' ||
      typeof note.tag !== 'string'
    ) {
      props.showAlert("Invalid note data. Please check your inputs.", "danger");
      return;
    }

    if (!note.title.trim() || !note.description.trim()) {
      props.showAlert("All fields are required!!", "danger");
      return;
    }

    if (note.title.trim().length < 3 || note.description.trim().length < 5) {
      props.showAlert("Title must be at least 3 characters and Description at least 5 characters", "danger");
      return;
    }

    setLoading(true);

    try {
      //addNote(...): Fires the function you pulled from your Context API.
      //It takes your typed-out title, description, and tag, and shoots them over to your main application data list
      const added = await addNote(note.title,note.description,note.tag);

      if (added) {
        props.showAlert("Added Successfully","success");

        // Clear out the input fields after successful addition
        setNote({ title: "", description: "", tag: "General" });
      } else {
        props.showAlert("Failed to add note. Please try again.","danger");
      }

    } catch (error) {
      console.error("Error adding note:", error);
      props.showAlert("Unable to add note. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  }

  const onChange=(e)=>{
    setNote({...note,[e.target.name]:e.target.value})
    //...note: The spread operator. It creates a copy of your existing note data so you don't erase the description while typing out the title.
    //[e.target.name]: e.target.value: Looks at the input element you are typing in. It grabs its HTML name property (like "title") and updates its object value to match what you just typed
  }

  //value={note.title}: Binds this text input directly to your local state.
  //This means the box will always display whatever text is inside your note.title variable

  return (
    <div>
      <div className="my-3 add-note-card shadow-sm">
        <div className="add-note-header">
          <div className="add-note-icon">📝</div>
          <div>
            <h1 className="add-note-title">Add a note</h1>
            <p className="text-muted small m-0">Create a new note to keep your ideas organized</p>
          </div>
        </div>

        <form onSubmit={handleClick}>
          <div className="row">
            <div className="col-md-8 mb-3">
              <label htmlFor="title" className="form-label">Title</label>

              <input
                type="text"
                className="form-control"
                id="title"
                value={note.title}
                name="title"
                onChange={onChange}
                placeholder="Note title (e.g. Project Roadmap)"
              />

              <div className="form-text d-flex justify-content-between mt-1">
                <span className={note.title.trim().length >= 3 ? "text-success fw-medium" : "text-muted"}>
                  {note.title.trim().length >= 3 ? "✓ Title is valid" : "Must be at least 3 characters"}
                </span>
                <span className="text-muted small">{note.title.length} / 3+</span>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="tag" className="form-label">Tag</label>

              <select
                className="form-select form-control"
                name="tag"
                value={note.tag}
                id="tag"
                onChange={onChange}
              >
                <option value="General">General</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Ideas">Ideas</option>
                <option value="Important">Important</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>

            <input
              type="text"
              className="form-control"
              name="description"
              value={note.description}
              id="description"
              onChange={onChange}
              placeholder="Write the details of your note..."
            />

            <div className="form-text d-flex justify-content-between mt-1">
              <span className={note.description.trim().length >= 5 ? "text-success fw-medium" : "text-muted"}>
                {note.description.trim().length >= 5 ? "✓ Description is valid" : "Must be at least 5 characters"}
              </span>
              <span className="text-muted small">{note.description.length} / 5+</span>
            </div>
          </div>

          <button
            disabled={loading || note.title.trim().length < 3 || note.description.trim().length < 5}
            type="submit"
            className="btn btn-primary px-4 py-2"
          >
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding Note...
              </span>
            ) : (
              "Add Note"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;

/*
You type a new note into AddNote.js and click submit.
AddNote.js calls your context function, which pushes the new note into the notes array inside NoteState.js.
Because the notes array changed, Notes.js wakes up, notices the new item, and automatically spawns a brand new, separate NoteItem.js card to display it on your screen
*/