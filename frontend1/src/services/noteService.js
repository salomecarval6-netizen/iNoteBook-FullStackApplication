// All API calls related to notes and user details are handled here.

// 1. Get All Notes from Backend
export const getNotesAPI = async (host, token) => {
  return await fetch(`${host}/api/notes/getUserNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Tells Express to expect JSON formatting
      // Read the token right now, inside the function!
      "auth-token": token
    },
  });
};

// 2. Add a Note
export const addNoteAPI = async (host, token, title, description, tag) => {
  return await fetch(`${host}/api/notes/addNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token
    },

    //Converts your live JavaScript object fields into a flat text string
    //so it can travel across a web connection safely
    body: JSON.stringify({ title, description, tag }),
  });
};

// 3. Delete a Note
export const deleteNoteAPI = async (host, token, id) => {
  return await fetch(`${host}/api/notes/deleteNoteById/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token
    },
  });
};

// 4. Edit a Note
export const editNoteAPI = async (host, token, id, title, description, tag) => {
  return await fetch(`${host}/api/notes/updateNote/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token
    },

    // Turns your fresh frontend JavaScript strings into JSON
    // so they can safely travel over HTTP to your backend server.
    body: JSON.stringify({ title, description, tag }),
  });
};

// 5. Get logged-in user details
export const getUserDetailsAPI = async (host, token) => {
  return await fetch(`${host}/api/auth/getuser`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token
    }
  });
};