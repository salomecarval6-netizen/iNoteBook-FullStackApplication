import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from 'bcryptjs';
import { generateJWT } from '../utils/generateJWT.js';
import { isValidObjectId } from "mongoose";


const createUser = asyncHandler(async (req, res) => {

  // 1.Get data
  const { name, email, password } = req.body;

  // 2.Validate
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !name.trim() ||
    !email.trim() ||
    !password.trim()
  ) {
    throw new ApiError(400, "All Fields are required!!");
  }

  // FIX: Normalize email so uppercase/lowercase variations do not accidentally create separate accounts.
  const normalizedEmail = email.trim().toLowerCase();

  // FIX: Basic email format validation.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    throw new ApiError(400, "Please enter a valid email address");
  }

  // FIX: Enforce reasonable input limits.
  if (name.trim().length > 100 || password.length < 8 || password.length > 128) {
    throw new ApiError(400, "Name or password does not meet the required limits");
  }

  // 3. Check if already exits
  // Change User.find() to User.findOne(). Since It returns null if empty, which is properly evaluated as false.
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(400, "User already exits!!");
  }

  // 4.Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 5. Save user
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword
  });

  /*
  Database error can be handled by asyncHandler function
  if(!user){
    throw new ApiError(400,"User not created");
  }
  */

  // 6.delete password
  const newUser = user.toObject();
  delete newUser.password;

  const token = generateJWT(newUser);

  return res.status(200).json(
    new ApiResponse(200, { newUser, token }, "User Created successfullyy!!")
  );
});


const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  //FIX: Validate login input before querying the database.
  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password
  ) {
    throw new ApiError(400, "Email and password are required");
  }

  //FIX: Use the same email normalization as signup.
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    // DEPLOYMENT FIX: Generic message avoids revealing whether an email exists.
    throw new ApiError(400, "Invalid email or password");
  }

  const loggedInUser = user.toObject();
  delete loggedInUser.password;

  const token = generateJWT(loggedInUser);

  return res.status(200).json(
    new ApiResponse(200, { loggedInUser, token }, "Logged in Succesfully!!")
  );
});


const getUser = asyncHandler(async (req, res) => {

  // ❌ OLD WAY: Read from insecure URL parameters
  // const {userId} = req.params;
  // for this to work the route inside router should exactly be router.get("/user/:userId", getUser);

  // NEW WAY: Read from the verified token object injected by fetchuser!
  const userId = req.user._id || req.user.id;

  // Method2:
  /*When a user visits a route like /api/auth/user/65cdb, Express reads the URL parameter, builds a standard object, and attaches it to the request. It looks exactly like this under the hood:
  req.params = {
    userId: "65cdb"
  };

  const userId = req.params.userId; is thus allowed
  inside the req object, find the nested object called params, and look up the value of the key named userId
  */

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid Id");
  }

  //FIX:
  // Exclude password from the database result itself.
  // Never send password hashes to the frontend.
  const user = await User.findById(userId).select("-password");

  //  FIX: Handle deleted/non-existing users.
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "User found!"));
});

export { createUser, loginUser, getUser };