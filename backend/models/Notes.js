import mongoose, {Schema} from 'mongoose';


const NotesSchema = new Schema({
  //to link notes to that specific user using unique id of that user
  user:{
    type:mongoose.Schema.Types.ObjectId,//tells MongoDB that this field cannot just be random text. It must be a unique 24-character hexadecimal MongoDB ID string
    ref:'User'//This specific ID belongs to a document inside the user collection
  },

  title:{
    type:String,//accept text values
    required: true
  },

  description:{
    type:String,
    required: true
  },
  tag:{
    type:String,
    default:"General"
  },
  date:{
    type: Date,
    default: Date.now //Date.now() passing a reference to the function instead of running it immediately when the server boots up.
  }  
}, {timestamps:true});

const Notes = mongoose.model('Notes',NotesSchema )
export  {Notes}

//This file is your Database Blueprint (or Schema). It lives inside your backend folder (models/Notes.js) and defines the strict layout of how a single note must look before MongoDB allows it to be saved

//Notes.js is the master list of written records. It holds the actual notes created inside the application

//A Note blueprint needs fields like title, description, and tag. But it makes no sense to put a password field on a Note