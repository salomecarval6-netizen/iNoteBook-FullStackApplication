
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext.jsx";
import NoteContext from './noteContext.jsx';


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

  // Token expired / invalid (401): clear the session and send the user to login
  const handleUnauthorized = () => {
    logout();
    setNotes([]);
    setUser(null);
    navigate("/login");
  };

// 1. This live React state array holds your data in the computer's RAM thus holds the list of notes currently visible on the screen
  let notesInitial=[]
  const [notes,setNotes]=useState(notesInitial)


// 1. Get All Notes from Backend
  const getNotes = async () => { //(async) because it has to wait for data to travel across a web network
      // 1. Grab the token stored during login/signup 
    try {
//Triggers a network request to your backend endpoint using fetch. The await keyword stops code execution until the server replies.
      const response = await fetch(`${host}/api/notes/getUserNotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // Tells Express to expect JSON formatting
// Read the token right now, inside the function!          
          "auth-token": localStorage.getItem('token')
        },
      });

      const json = await response.json();
      console.log(json);
//Saves that fresh array directly into your React state, triggering an instant UI refresh to show the notes list.
      
      if (response.status === 401) { handleUnauthorized(); return; }

      if (json.success && json.data) {
  // This populates the notes state with actual backend data since we send in ApiResponse the data 
          setNotes(json.data); // Saves the clean array: [ {_id: '...', title: 'HELLO'} ]
          //to concat imp
      } else {
          setNotes([]); // Fallback to an empty array if something went wrong
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
      const response = await fetch(`${host}/api/notes/addNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
//Converts your live JavaScript object fields into a flat text string so it can travel across the web connection safely
        body: JSON.stringify({ title, description, tag }),
      });

      //Read the response packet from Node.js
//Awaits and extracts the finished note object sent back by MongoDB (which now includes its brand-new generated unique _id).
      const note = await response.json(); // Gets the saved note object with real MongoDB _id
// 3. Check if the backend successfully saved it to MongoDB
    if (response.status === 401) { handleUnauthorized(); return false; }

    if (note.success) {
        // json.note contains the exact note object returned by MongoDB (with its new _id)
      //const newNoteFromBackend = json.note;
    
//Update React State
//Safely generates a completely fresh array, appending the new item to the bottom of the current list to trigger an accurate UI update without mutating the state directly.
      setNotes([...notes, note.data]); // Safely updates state to trigger UI render
      return true;
    }
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
    //fetch(): Triggers a network request across the internet to your Node.js/Express api.
    //${host}/api/notes/deletenote/${id}: Uses string interpolation to stitch your backend server port URL to your dynamic endpoint route, passing the exact note ID straight through the URL path parameters.  
      const response = await fetch(`${host}/api/notes/deleteNoteById/${id}`, {
        /* Instead u can use this block to excatly know
        if (!response.ok) {
        const error = await response.text();
        console.error(error);
        return;
        }

        const json = await response.json();
        console.log(json);
        */

        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token":localStorage.getItem('token')
        },
      });

      console.log(response);
//FIX : ERROR DUE TO =>const json=await response.json();



/*response.json: "I expect the server to send me JSON. Parse it into a JavaScript object."

If the log says status: 200 and ok: true, and your backend controller contains a .json() return statement, the data over the wire is always JSON.
You should only assume it is text if the status is 500 Internal Server Error or 404 Not Found and your console explicitly throws an error saying Unexpected token '<' ... is not valid JSON

response.text: "Don't try to parse anything. Just give me the raw response as plain text.
It doesn't matter whether the response is JSON, HTML, or plain text—it simply returns it as a string."

Your backend was not returning valid JSON at that moment. It may have been returning an HTML error page or plain text.
With .json(), the browser tried to parse HTML as JSON. 
With .text(), it simply accepted the response as text, so no parsing error occurred.

 using a standardized ApiResponse utility class on your Node.js backend, every single successful route in your application will always return JSON.

  should only ever switch to response.text() if:Your backend controller uses res.send("Plain text string") instead of res.json()

*/
      
      if (response.status === 401) { handleUnauthorized(); return false; }

      const text=await response.json();

      // Only remove the note from the screen if the server really deleted it
      if (!text.success) {
        console.error("Backend failed to delete the note:", text.message);
        return false;
      }
//always at each step console is must since in we get to know where theres error in frontend baackend connection.      
      console.log(text);

//notes.filter(...): This is a native JavaScript loop array tool. It reads your current list of notes on the screen, goes through them one by one, and builds a brand-new array filled only with items that pass a specific true/false conditional test.
      const newNotes = notes.filter((note) => {
        const noteId = note._id || note.id;
        return noteId.toString() !== id.toString();
        //id is the ID of the note you just clicked delete on.
        //noteId is the ID of the note card the loop is currently looking at.

      });

//setNotes(newNotes): Takes that freshly scrubbed array (which now contains all your notes except the deleted one) and writes it into your primary React view memory state.
//Because React detects that your data state changed, it instantly triggers a visual re-render. The deleted card vanishes from the webpage right before the user's eyes without needing a page refresh.
      setNotes(newNotes);
      return true;
    } catch (error) {
      console.log("Error deleting note:", error);
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
      const response = await fetch(`${host}/api/notes/updateNote/${id}`, {
          method: "PUT", // Usually PUT or PATCH is used for updates instead of POST
          headers: {
            "Content-Type": "application/json",
            "auth-token":localStorage.getItem('token')
          },
// Turns your fresh frontend JavaScript strings (title, description, tag) into a raw JSON text string so it can safely travel over HTTP to your backend server.
          body: JSON.stringify({ title, description, tag }),
      });

      const json=await response.json();
      console.log(json)
//Creates a complete deep clone copy of your current array so you can edit the elements without modifying the active state directly
// Deep copy array to force React to detect changes and trigger UI re-render
      if (response.status === 401) { handleUnauthorized(); return false; }

      if(json.success){

{/*In JavaScript, arrays and objects are stored in memory using address pointers. If you try to create a copy of your notes array using a simple equals sign (=), you aren't actually copying the data. You are just creating a new pointer to the exact same spot in memory. */}

//first raw plain text string then builds a completely fresh, brand-new JavaScript array object 
      //let newNotes = JSON.parse(JSON.stringify(notes));
//Starts a standard for loop that goes through your freshly cloned list of notes one by one. element represents the current note in the loop.      
     /* for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if (element._id === id) {
          // Use the exact verified data returned from your backend ApiResponse
          element.title = json.data.title;
          element.description = json.data.description;
          element.tag = json.data.tag;
          break;
        }
      */
     const newNotes=notes.map((note)=>{
      const noteId= note.id || note._id;
//Without .toString(), the comparison noteId === id evaluates to false. What JavaScript sees behind the scenes:ObjectId("6a96150bb749604f6c4a80ff") === "6a96150bb749604f6c4a80ff"

//here noteId is (A Mongoose Object) is not a string—it is a specialized, 24-character binary structure called an ObjectId class object.
//id is (A JavaScript Text String): 
      if(noteId.toString() ===id.toString()){
        return {...note,title,description,tag};
      }
      return note;
     });

     setNotes(newNotes);
     return true;
      } else {
            console.error("Backend failed to update the note:", json.message);
            return false;
      }

    } catch (error) {
      console.log("Error updating note:", error);
      return false;
    }
  };


  // 1. Add a new state for user details
const [user, setUser] = useState(null);

// 2. Add a function to fetch logged-in user details
const getUserDetails = async () => {
    if (!localStorage.getItem('token')) return;

    try {
        const response = await fetch(`${host}/api/auth/getuser`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')   //thus only that user will be logged in
            }
        });
        const json = await response.json();
if (response.status === 401) { handleUnauthorized(); return; }
//Json now contains the entire object we defined inside our ApiResponse structure i.e res.status(code,payload,msg)
        if(json.success && json.data){
          setUser(json.data);
        }
         
    } catch (error) {
        console.error("Failed to fetch user details", error);
        setUser(null);
    }
};


    return(
    // 2. This is where the empty pipe gets filled with real live data!    
      <NoteContext.Provider value={{notes,addNote,delNote,editNote,getNotes, user, getUserDetails, setUser, setNotes}}>
        {props.children}
{/*props.children is a built-in React property used to capture and render whatever components, HTML elements, or text are placed between the opening and closing tags of a parent component. 
(Here, NoteContext). It acts as a dynamic layout placeholder, allowing a component to function as a generic wrapper or container. */}
      </NoteContext.Provider>
    )
//The .Provider is a special built-in React component. Its only job is to provide data to components that sit inside it. It tells React: "Anyone inside my boundaries has full permission to listen to my data broadcast."

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