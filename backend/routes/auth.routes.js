//req (Request) — What is coming INWhenever your React app communicates with your server using fetch(), Express packages that information into a JavaScript object named req

//res (Response) — What is going OUTThe res object contains built-in Express tools used to pack up data and send it across the network back to your React app. A request is stuck hanging in the browser until you call a res function to close the connection

//An API router is a software component that directs incoming API requests to the correct backend code based on the request's URL path and HTTP method
//const express= require('express');
//const router= express.Router();

import express from 'express'


//Imports your Mongoose User model to query and save users to MongoDB
//const User= require('../models/User');

import {fetchuser} from '../middleware/fetchuser.js';
//Imports data validation tools to verify email formats and password lengths.
import {createUser, loginUser,  getUser } from '../controllers/user.controller.js'

// Setup Express Router
const router = express.Router();

//Imports a security library used to safely scramble and check passwords.
//const bcrypt =require("bcryptjs");

//Imports JSON Web Token to generate signed user identity tokens
//var jwt = require('jsonwebtoken');

//Creates a secret signature key. Only your backend knows this key to verify if tokens are authentic
//const JWT_SECRET='salome_is_sweet';


//Imports custom gatekeeper middleware that verifies a user's token before granting access
//const fetchuser= require('../middleware/fetchuser');
//this is accessible when '/api/auth/createuser' this endpoint is used in web-browser
let success =false;

//ROUTE 1: header 'Content-type' value 'application/json'
//Creates a POST route at /api/auth/createuser.



//Create a User using: POST "/api/auth/". No login required
//Use body('email') to check data sent via a form or JSON payload.
//Use query('search') to check data sent via the URL string.
router.route('/createuser').post(createUser) //'/createuser' represents the URL path (or endpoint) 
 
    /*
//A]the 'new' keyword to create the user instance
//This creates a local Javascript object instance.
//It does not touch your database until you explicitly call .save()
    const user=new User(req.body);
    await user.save();
*/

//I





//ROUTE 2:
//Authenticate a user using: POST "/api/auth/login". No login required
//Defines your /api/auth/login endpoint and ensures inputs are formatted correctly and not empty
router.route('/login').post(loginUser)
//ROUTE 3: header 'auth-token' with respective 'token' as value
//Get loggedin user details using POST "/api/auth/getuser." Login required


//Creates a protected route. Notice that fetchuser is inserted right in the middle. The request must successfully pass through that middleware script before running the final block.
// ❌ CHANGED THIS :
// router.route('/getuser/:userId').get(fetchuser, getUser) 
//"/api/auth/getuser/:userId" should exactly match this to pass id to controller


//  TO THIS :
router.route('/getuser').get(fetchuser, getUser);

//auth.js (The Gatekeeper): This file is all about Identity. It handles creating new accounts (/createuser) and logging users in (/login). Its only job is to check passwords and issue that unique, unforgeable auth-token signature string

export default router;