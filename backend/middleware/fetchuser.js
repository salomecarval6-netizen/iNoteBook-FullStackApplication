//In Express, a middleware function is a piece of code that sits like a security gatekeeper in the middle of a request-response cycle. It runs after the request comes from React, but before it reaches your final database route (like /fetchallnotes).

import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js'
import User from '../models/User.js';


//job is to intercept incoming requests and check if the user is logged in
//before letting them access protected data like notes.


/*
TYPE 2 TO HANDLE ERROR:

1. When error occurs inside if block the execution halts completely and enters inside catch bloack.

2.Because the thrown item is an instance of your custom ApiError class, this if statement evaluates to true. 

3.Your code then explicitly executes next(error), which pushes that error out of the middleware and straight into your Global Error-Handling Middleware to send the clean JSON response to React. 

*/
const fetchuser=async (req,res,next)=>{ //next is a built-in Express function
  //get user from jwt token and add it to req object

  const token=req.header('auth-token');//The middleware looks into the incoming HTTP request headers for a key named auth-token. 
                                      //This is where your React frontend (or Thunder Client) attaches the saved JWT token string

  if(!token){
    return res.status(401).send({error:"please authenticate using valid token"})
  }

  try{
  //JWT SECRET: This is your server's private master key. Only your server knows this string. It is used to verify that incoming tokens were actually made by your backend
    
  //middleware only attaches the JWT token payload data
  const decoded =jwt.verify(token,process.env.JWT_SECRET);

    if(!decoded){
      throw new ApiError(400,"Invalid token!!");
    }

    //Ensure the payload property matches what you signed (typically 'id', '_id', or nested 'user.id')
    const userId = decoded._id || decoded.id || decoded.user?.id;

    const user= await User.findById(userId);

    if (!user) {
      throw new ApiError(400, "User no longer exists")
    }
//If your backend architecture uses a custom ApiError constructor class, it must be thrown or passed down via next(error) so that your central global error-handling middleware can parse its properties correctly.
//The code completely halts here. 
    req.user= user; // injecting the full Mongoose User document!

    //req.user=data.user;//This line takes that decoded user data packet and injects it straight into the Express req (request) object. Because objects are passed by reference, 
//this means the next function in line will be able to read req.user.id instantly
    next()//This opens the gate. It tells the Express router that authentication succeeded, allowing the code to move forward to your note operations (like fetchallnotes)

  }  catch(error) {//error now holds the exact ApiError object you threw up on line 37
    // If code threw an ApiError inside the try block (like User no longer exists), pass it forward
    if (error instanceof ApiError) {
      //A.return next(error);  
      //If your global error router isn't catching next(error), explicitly respond here
      return res.status(error.statusCode || 400).json({ success: false, message: error.message });
     }
    // If it's a structural JWT error (expired, tampered), wrap it cleanly in your ApiError structure
    return next(new ApiError(401, "please authenticate using valid token"));
  }

}
export {fetchuser};


//1. req (The Request Object)What it is: This is the incoming data package sent from your React app. It contains the headers, url parameters, and body text.Why it's here: fetchuser needs access to req so it can search through the request headers to find the auth-token. Later, if the token is valid, it injects the decoded user ID right into req.user so other files can read it

//2. res (The Response Object)What it is: This is your server's outgoing delivery tray used to send data back across the internet to your user's browser.Why it's here: fetchuser needs res in case the token is missing or fake. If the user is unauthenticated, the middleware uses res.status(401).send(...) to block them and return an error message immediately, halting the request.

//3. next (The Express Traffic Cop)What it is: This is a built-in Express function unique to middleware scripts.Why it's here: Unlike a normal route that finishes by sending data back to the user via res.json(), middleware finishes by executing next(). This acts like opening a security gate, telling Express: "This user is verified, move them along to the next function in line!"