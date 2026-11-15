import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext.jsx";
import NoteContext from './noteContext.jsx';

import {getNotesAPI, addNoteAPI,deleteNoteAPI,editNoteAPI,getUserDetailsAPI} from "../../services/noteService.js";


//Step 2: The Provider fills the pipe (The Water Pump) :
//Inside your NoteState.jsx file, you create your live data states and functions, and you pass them into the .Provider's value property:

const NoteState = (props) =>{

  //s1 holds the original, unchanging starting data
  /*
  const s1= {
    "name":"Salome",
    "class":"5B"
  }

  //state is the actual live React state variable, initialized with s1
  const [state,setState]=useState(s1);

  const update=()=>{
    setTimeout(()=>{
      setState({
        "name":"tia",
        "class":"10C"
      })
    },2000);
  }
  //You pass 'state' because it is the live variable that can change

  <NoteContext.Provider value={{state,update}}> Object Property Shorthand:state (the data) and update (the function to change the data)
*/

  // Uses environment variable in production, falls back to localhost:5000 in development
  const host = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // 1. This live React state array holds your data in the computer's RAM thus holds the list of notes currently visible on the screen
  let notesInitial=[]
  const [notes,setNotes]=useState(notesInitial);

  // 1. Add a new state for user details
  const [user, setUser] = useState(null);

  // Token expired / invalid (401): clear the session and send the user to login
  const handleUnauthorized = () => {
    logout();
    setNotes([]);
    setUser(null);
    navigate("/login");
  };


// 1. Get All Notes from Backend
  const getNotes = async () => { //(async) because it has to wait for data to travel across a web network

    // 1. Grab the token stored during login/signup
    try {

      // DEPLOYMENT FIX: Check whether a token exists before sending the request.
      const token = localStorage.getItem('token');

      if (!token) {
        handleUnauthorized();
        return;
      }

      //Triggers a network request to your backend endpoint using fetch.
      //The await keyword stops code execution until the server replies.
      const response = await getNotesAPI(host, token);

      // DEPLOYMENT FIX: Handle an expired session before processing response data.
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const json = await response.json();
      console.log(json);

      //Saves that fresh array directly into your React state,
      //triggering an instant UI refresh to show the notes list.
      if (response.ok && json.success && Array.isArray(json.data)) {

        // This populates the notes state with actual backend data
        // since we send in ApiResponse the data
        setNotes(json.data);

      } else {
        setNotes([]);
        console.error("Failed to fetch notes:", json.message);
      }

    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };


/*

2. Why addNote only needs 1 custom functionThe Action: You type a new note into a blank form that is permanently open at the top of your dashboard
.The Data: The input fields for adding a note start completely blank ("").Why no second function? Because the fields start empty, you don't need a function to pre-populate them with old text. You just type into the blank boxes and hit submit, which calls addNote().

*/

  // 2. Add a Note
  const addNote = async (title, description, tag) => {
    try {

      const token = localStorage.getItem('token');

      // DEPLOYMENT FIX: Do not make authenticated requests without a token.
      if (!token) {
        handleUnauthorized();
        return false;
      }

      const response = await addNoteAPI(host, token, title, description, tag);

      if (response.status === 401) {
        handleUnauthorized();
        return false;
      }

      const note = await response.json();

      // 3. Check if the backend successfully saved it to MongoDB
      if (response.ok && note.success && note.data) {

        // Safely generates a completely fresh array, appending the new item
        // without mutating the state directly.
        setNotes((currentNotes) => [...currentNotes, note.data]);

        return true;
      }

      console.error("Backend failed to add note:", note.message);
      return false;

    } catch (error) {
      console.error("Error adding note:", error);
      return false;
    }
  };

/*
1. Why deleteNote only needs 1 custom functionThe Action: When you click delete, you click a trash icon next to a specific note.The Data: The browser already knows exactly which note you clicked on. Its ID (note._id) is passed instantly into the click event.
Why no second function? There is no intermediate step! You do not need to fill out a form or change any text before deleting. The app can immediately fire the deleteNote(id) context function to remove it from MongoDB.

*/

  // 3. Delete a Note
  //The frontend Delete function needs the 'id' parameter passed in
  const delNote = async (id) => {
    try {

      const token = localStorage.getItem('token');

      // DEPLOYMENT FIX: Ensure an authenticated request.
      if (!token) {
        handleUnauthorized();
        return false;
      }

      //fetch(): Triggers a network request across the internet to your Node.js/Express api.
      //${host}/api/notes/deleteNoteById/${id}: Uses string interpolation to stitch your backend server port URL to your dynamic endpoint, passing the exact note ID straight through the URL path parameters.
      const response = await deleteNoteAPI(host, token, id);

      if (response.status === 401) {
        handleUnauthorized();
        return false;
      }

      const json = await response.json();

      // Only remove the note from the screen if the server really deleted it
      if (!response.ok || !json.success) {
        console.error("Backend failed to delete the note:", json.message);
        return false;
      }

      console.log(json);

      //notes.filter(...): This is a native JavaScript loop array tool.
      //It reads your current list of notes on the screen and builds a new array.
      //setNotes(newNotes): Remove the deleted note from the latest state snapshot.
      setNotes((currentNotes) => currentNotes.filter((note) => {
        const noteId = note._id || note.id;
        return noteId && noteId.toString() !== id.toString();
      }));

      //Because React detects that your data state changed,
      //it instantly triggers a visual re-render.
      return true;

    } catch (error) {
      console.error("Error deleting note:", error);
      return false;
    }
  };


/*

3. Why editNote DEMANDS 2 functions (The Core Difference)Editing is unique because it is a two-step process that combines pieces of both adding and deleting. It needs data from an existing note, but it also requires a form for new typing.
Step 1 (updateNote): When you click edit on a card, the application cannot just save it immediately (like delete). It needs to open a modal and copy the old text into the form so you can see what you are changing. That requires a function.
Step 2 (editNote): The application must now wait for you to finish typing. Only when you click the "Update" button does it gather your new text and call the context worker to save it to MongoDB. That requires a second function

*/

// 4. Edit a Note
  const editNote = async (id, title, description, tag) => {

    try {

      const token = localStorage.getItem('token');

      // DEPLOYMENT FIX: Ensure an authenticated request.
      if (!token) {
        handleUnauthorized();
        return false;
      }

      const response = await editNoteAPI(host, token, id, title, description, tag);

      if (response.status === 401) {
        handleUnauthorized();
        return false;
      }

      const json = await response.json();
      console.log(json);

      if (response.ok && json.success && json.data) {

        // Use the canonical note returned by the backend
        // so the UI mirrors the saved database record.
        setNotes((currentNotes) => currentNotes.map((note) => {
          const noteId = note.id || note._id;

          if (noteId && noteId.toString() === id.toString()) {
            return json.data;
          }

          return note;
        }));

        return true;

      } else {
        console.error("Backend failed to update the note:", json.message);
        return false;
      }

    } catch (error) {
      console.error("Error updating the note:", error);
      return false;
    }
  };


  // 2. Add a function to fetch logged-in user details
  const getUserDetails = async () => {

    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await getUserDetailsAPI(host, token);

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const json = await response.json();

      //Json now contains the entire object we defined inside our ApiResponse structure
      if (response.ok && json.success && json.data) {
        setUser(json.data);
      } else {
        setUser(null);
        console.error("Failed to fetch user details:", json.message);
      }

    } catch (error) {
      console.error("Failed to fetch user details", error);
      setUser(null);
    }
  };


  return(
    // STEP 2. This is where the empty pipe gets filled with real live data!

    //.Provider => supplies the data
    <NoteContext.Provider value={{
      notes,
      addNote,
      delNote,
      editNote,
      getNotes,
      user,
      getUserDetails,
      setUser,
      setNotes
    }}>
      {props.children}
      {/*Here, props.children renders it's child components from app.jsx .provider provides the value to this compoennets */}

      {/*props.children is a built-in React property used to capture and render whatever components, HTML elements, or text are placed between the opening and closing tags of a parent component.
      (Here, NoteContext). It acts like a dynamic layout placeholder, allowing a component to function as a generic wrapper or container. */}
    </NoteContext.Provider>
  )

//The .Provider is a special built-in React component. Its only job is to provide data to components that sit inside it.
//It tells React: "Anyone inside my boundaries has full permission to listen to my data broadcast."

//{{ ... }}, you are packing a list of assets that you want your whole app to share.
//In React, props.children automatically represents whatever components you place inside the <NoteState> tags in your main App.js file (like your Navbar, Home page, Alert boxes, and About page).
}

export default NoteState;

//The Broadcaster (NoteState.js): This file holds all your data (notes array) and functions (addNote, getNotes). It broadcasts them to the whole app



//VERY IMP FIX-ERROR :
/*
 It is sending back a curly-brace Object that contains two keys inside it (success and notes), rather than a clean, flat list array.

Array.isArray(notes) evaluates to false because an Object is not an Array!
You need to tell React to look inside the object and save just the nested notes array key.


*/