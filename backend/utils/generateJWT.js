import jwt from 'jsonwebtoken'


const generateJWT = (user)=>{

    // Prepare payload data containing the unique MongoDB user ID
  const payload = {
    user: {
      id: user._id // Mongoose documents store the identifier under _id
    }
  };

  const JWT_SECRET = process.env.JWT_SECRET || 'salome_is_sweet';
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  return token;

}

export {generateJWT}

