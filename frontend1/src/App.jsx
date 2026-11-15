import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css' ;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useState, useEffect} from 'react'
import NavBar from './components/NavBar.jsx';
import Alert from './components/Alert.jsx';
import { NotesDashboard} from './pages/NotesDashboard.jsx'
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotFound from './pages/NotFound.jsx';
import NoteState from './context/notes/noteState.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  const [alert,setAlert]=useState(null);
    useEffect(() => {
    // 2. ADD THIS LINE to initialize Bootstrap interactive features dynamically
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])


const showAlert=(message,type)=>{
  setAlert({
    message:message,
    type:type
  })
  setTimeout(()=>{
    setAlert(null);
  },1500);
}
  return (
    <>
  {/*Router MUST be the top parent layer so Context can use hooks */}
  <Router>
  <AuthProvider>
  <NoteState>
    <div className="app-container">
    <NavBar/>
 {/* ⬇️ THIS ENTIRE CHUNK BECOMES props.children ⬇️ */} 
 {/*This div is given since alert was chnaging tha layout of screen when t was appearning and siappearing so gave a fixed size to the alert */}
 <div className="container" style={{ height: "55px", marginBottom: "5px" }}>
<Alert alert={alert}/>
 </div>
   
    <main className="main-content">
      <div className="container">
        <Routes>
          {/* 'path' is the URL, 'element' is the component it renders */}
           {/* The default root view pane layout page */}
          <Route exact path="/" element={<Home showAlert={showAlert}/>} />   {/*Things to be shown immediatedly as your page loads */}
          <Route exact path="/login" element={<Login showAlert={showAlert}/>} />
          <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
          {/*Every single page layout component that you want to display via a URL path must be registered inside the <Routes> block in your App.jsx file. */}
           <Route exact path="/dashboard" element={<NotesDashboard showAlert={showAlert} />} />
           <Route exact path="/about" element={<About />} />
           {/* Fallback 404 Route for any unmatched paths */}
           <Route path="*" element={<NotFound />} />

          {/*Creating dedicated pages and URL paths like /logout or /profile-popup just to handle basic button clicks or small status boxes adds a massive amount of unnecessary clutter to your project.
           <Route exact path="/profile" element={<Profile showAlert={showAlert} />} />
           <Route exact path="/logout" element={<Logout showAlert={showAlert} />} />
           */}
        </Routes>
      </div>
    </main>

    <footer className="app-footer">
      <div className="container">
        <p className="mb-0">iNotebook &copy; {new Date().getFullYear()} &mdash; Your Notes, Your Ideas, Your Space</p>
      </div>
    </footer>
    </div>
 {/* ⬆️ THIS ENTIRE CHUNK BECOMES props.children ⬆️ */}   
  </NoteState>
  </AuthProvider>
  </Router>
   </>
  );
}

export default App;
