import express from 'express';

import dotenv from "dotenv"; //  Modern ES Module syntax
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;   //http://localhost:5000 (The Server Port)

import connectToMongo from './db.js';
import cors from 'cors';

connectToMongo();

// npm i -D nodemon in terminal

// npx nodemon index.js


// This allows all origins
app.use(cors());

//is a middleware that tells your Express server to automatically read and parse incoming JSON data.
//Without this line: Express receives the raw text but doesn't know what to do with it. If you try to look at req.body to see the data, it will just show up as undefined.
//With this line: Express intercepts the request, reads the raw text, converts it into a clean JavaScript object, and stuffs it into req.body so you can easily read it.
app.use(express.json())

import authRouter from './routes/auth.routes.js';
import notesRouter from './routes/notes.routes.js';

//Avaiable Routes: 
app.use('/api/auth',authRouter)  //Any incoming URL requests that begin with /api/auth should be handed over directly to the authRouter file 
app.use('/api/notes',notesRouter)



//async behaviour thus express loads first then mongo


app.use((err,req, res, next)=>{

  console.error("[EXPRESS PIPELINE ERROR CRASHED]:");
    console.error(err.stack || err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message:message,
        errors: err.errors || []
    })
})


app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`);
});

