//Displays the individual data

import { useContext } from "react";
import NoteContext from '../context/notes/noteContext.jsx'

//WAY 1: Getting data from Props (Passed down from Notes.js)
const NoteItem = (props) => {

  //extracts the individual note object (containing title, description, etc.) and the updateNote function from the incoming props.
  const { note, updateNote, confirmDelete } = props;


// WAY 2: Getting tools from Context (Grabbed directly from global store)
  const context = useContext(NoteContext);
  //It reaches out to grab delNote and editNote so that clicking icons on this individual card can trigger global application actions.
  const { delNote} = context;

  // Formats MongoDB ISO date into a readable format (e.g. Nov 1, 2026)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch">
      <div className="card my-3 note-item-card w-100">
        <div className="card-body">
          <div className="d-flex flex-column h-100 justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-1">
                {note.tag && <span className="note-tag-badge m-0">🏷️ {note.tag}</span>}
                {(note.date || note.createdAt) && (
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                    🕒 {formatDate(note.date || note.createdAt)}
                  </span>
                )}
              </div>
              <h5 className="card-title note-card-title" style={{cursor: "pointer"}}> {note.title} </h5>
              <p className="card-text note-card-text">{note.description}</p>
            </div>
            <div className="note-card-actions justify-content-end">
              <button 
                className="btn btn-outline-secondary btn-sm mx-1" 
                title="Copy note text"
                onClick={() => {
                  navigator.clipboard.writeText(`${note.title}\n\n${note.description}`);
                  if (props.showAlert) {
                    props.showAlert("Note copied to clipboard!", "success");
                  }
                }}
              >
                📋 Copy
              </button>
              <button  className="btn btn-outline-danger btn-sm mx-1" onClick={() => {
                if (confirmDelete) {
                  confirmDelete(note);
                } else {
                  console.log("item deleted");
                  console.log(note._id);
                  delNote(note._id);
                }
              }}> Delete </button>          
              <button className="btn btn-outline-primary btn-sm mx-1"  onClick={()=>{ updateNote(note);}}> Edit </button>
{/*At this exact millisecond, you haven't typed any changes yet. If you ran your global context editNote() right now, you would just be saving the exact same text back into MongoDB.
Instead of calling the context function, clicking the edit icon triggers your useRef crane arm to instantly hit a hidden button that pops open the Bootstrap Edit Modal form on the screen */}            
            </div>
          </div>         
        </div>
      </div>
    </div>
  );
};

export default NoteItem;

// Its only job is to receive a single note's data and render a clean, visual card for it on your screen, complete with Delete and Edit action icons.

/*
The Two Main Ways Components Get Data:

Way 1: Props (The "Bucket Brigade" Method):
Data is passed directly down from a parent component to a child component, like passing a physical box down a line of people.How it looks: <NoteItem note={singleNote} />

Way 2: Context API (The "Radio Broadcast" Method):
Data floats in a global cloud above your application. Any component can tune in and grab data directly, completely skipping the parent components.
How it looks: const context = useContext(NoteContext);

*/
