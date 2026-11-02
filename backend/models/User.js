// 1. Import mongoose the classic way
//This is the classic, traditional Node.js way.
import mongoose, {Schema} from 'mongoose';



/*import (ES Modules): 
This is the modern JavaScript way used in frontend frameworks like React

to use import: You must go to your package.json file and add "type": "module", otherwise your code will crash
import mongoose from 'mongoose';
const { Schema } = mongoose;
*/

// 2. Build your schema directly
const UserSchema = new Schema({
  name:{
    type:String,
    required: true
  },
  email:{
    type:String,
    required: true,
    unique: true
  },
  password:{
    type:String,
    required: true
  },
  date:{
    type: Date,
    default: Date.now //Date.now() dont execute function just give
  }  
});


// 3. Export it the classic way
const User=mongoose.model('User',UserSchema)
export default User;
//This line of code packages your Mongoose database blueprint and exports it so 
// other files in your project can use it to create, read, update, or delete users

//User.js is the master list of accounts. It validates who is allowed into the application

//A User blueprint needs an email and a secure password, but a user profile doesn't have a tag or a descriptio