const host = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Login user
export const loginUser = async (credentials) => {

//fetch sends a network request to your local Node.js/Express backend authentication endpoint.
    const response = await fetch(`${host}/api/auth/login`, {
        method: "POST",
//headers tell the backend that the incoming payload data format is JSON.        
        headers: {
          "Content-Type": "application/json",
        },
//body: JSON.stringify(...) converts your local JavaScript state object into a raw JSON text string for transmission over the network.
        body: JSON.stringify({email:credentials.email,password:credentials.password})
      });

      return response;
};


// Signup user
export const signupUser = async (userData) => {
    const response = await fetch(`${host}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
      });

      return response;
};