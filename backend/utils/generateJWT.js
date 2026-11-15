import jwt from 'jsonwebtoken';

const generateJWT = (user) => {

  // Prepare payload data containing the unique MongoDB user ID
  const payload = {
    user: {
      id: user._id // Mongoose documents store the identifier under _id
    }
  };

  //FIX:
  // Never use a hardcoded fallback JWT secret.
  // The secret must be configured through backend environment variables.
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  return token;
};

export { generateJWT };