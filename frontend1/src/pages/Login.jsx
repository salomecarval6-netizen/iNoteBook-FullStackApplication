// Login.jsx

import {useState,useContext} from "react";
import { useNavigate, Link } from 'react-router-dom';
import NoteContext from '../context/notes/noteContext.jsx'
import AuthContext from '../context/AuthContext.jsx'
import { loginUser } from '../services/authService.js';


const Login = (props) => {
  const navigate = useNavigate();
  const[credentials,setCredentials]=useState({email:"",password:""})
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const context = useContext(NoteContext);
//let history=useHistory();

  const {getUserDetails}=context;
  const {saveToken}=useContext(AuthContext);
     
  //async marks this function as asynchronous, allowing you to use await for API requests
  const handleSubmit= async (e)=>{
      e.preventDefault();
      setLoading(true);

  try{

//Waits for the backend to reply and parses the incoming data response string back into a usable JavaScript object.      
      const response = await loginUser(credentials);
      const json= await response.json();
      console.log(json);


//Checks if the backend returned a successful status flag (usually success: true)      
      if(json.success){

//Saves the secure authentication token string into the browser’s persistent local storage. This keeps the user logged in even if they refresh the tab.
        
        // 1. Save it permanently so refreshes don't break your app! Thus Dashboard's useEffect can safely, reliably read it using localStorage.getItem('token')—even if the user closes the browser, reopens it, or refreshes the page
        saveToken(json.data.token);

//Checks if getUserDetails exists in your context, then executes it to immediately fetch the user's name or notes profile so the rest of the application updates.  
        if (getUserDetails) {
          await getUserDetails();
        }

   // 4. Redirect the user to the page where notes can be displayed
   /* PASSING THE STATE PACKET VIA NAVIGATE:
   Is allowed but refreshing the page may break app and also may cause other features to lock
        navigate('/Dashboard', {
          state:{
            token: json.data.token
          }
        });
    */
        // 2. Redirect to your clean dashboard path
        navigate('/dashboard');
  //history.push("/");
        props.showAlert("Logged in Successfully!","success")

      }
        else{ 
          //in backend we have created ApiError class with message field
          props.showAlert(json.message|| "Invalid Credentials","danger")
      }  
      } catch (error) {
         console.error("Login process failed:", error);
         props.showAlert("Server connection error. Please try again later.", "danger");
      } finally {
         setLoading(false);
      }

};


//Triggers every single time a key is pressed inside an input field.
// ...credentials copies the current email and password values so you don't overwrite one while typing in the other.
// [e.target.name]: e.target.value looks at the HTML name property of the input field (email or password) and updates that matching key dynamically.
const onChange=(e)=>{
    setCredentials({...credentials,[e.target.name]:e.target.value})
  }




  return (
    <div className="auth-wrapper">
      <div className="auth-card">  {/*standard default size, which equals exactly 1rem or 16px. Scale from 0-5 */}
        <div className="auth-icon-badge">🔐</div>
        <h2 className="auth-title">Login to continue</h2>
        <p className="auth-subtitle">Welcome back! Sign in to access your notes</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label"> Email address</label>
            <input type="email"  className="form-control" value={credentials.email} id="email" name="email" onChange={onChange} aria-describedby="emailHelp" placeholder="name@example.com" required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label"> Password</label>
            <div className="input-group">
              <input type={showPassword ? "text" : "password"} className="form-control" name="password" value={credentials.password} id="password" onChange={onChange} placeholder="••••••••" required />
              <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)} title={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="text-center mt-3 pt-3 border-top">
          <span className="text-muted small">Don't have an account? </span>
          <Link to="/signup" className="fw-semibold text-decoration-none">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;