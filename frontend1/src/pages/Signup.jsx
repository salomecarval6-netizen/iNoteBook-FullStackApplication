import {useState, useContext} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';


const Signup = (props) => {
    const navigate = useNavigate();
    const { saveToken } = useContext(AuthContext);
    const[credentials,setCredentials]=useState({name:"", email:"",password:"",cpassword:""})
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const  {name,email,password,cpassword}=credentials;

// 1. Client-Side Validation: Ensure passwords match before hitting the API
        if (password !== cpassword) {
             props.showAlert("Passwords do not match!", "danger");
             return;
        }
        try{
            setLoading(true);
            const host = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
            const response = await fetch(`${host}/api/auth/createuser`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",  
              },
              body: JSON.stringify({name,email,password})
            });

              const json= await response.json();
              console.log(json);

            if(json.success){
  
            saveToken(json.data.token);
 
 // 4. Redirect the user to the home page where notes are displayed
            navigate("/dashboard"); 
            props.showAlert("Account Created Successfully!","success")
          }
          else{

              props.showAlert(json.message|| "An account with this email already exists.","danger")
          }
        }catch (error) {
              console.error("Signup error:", error);
              props.showAlert("Server connection error. Please try again later.", "danger");
        } finally {
              setLoading(false);
        }
    }


const onChange=(e)=>{
    setCredentials({...credentials,[e.target.name]:e.target.value})
}


  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-icon-badge">✨</div>
        <h2 className="auth-title">Create an account to use iNotebook</h2>
        <p className="auth-subtitle">Start organizing your thoughts and ideas today</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
           <label htmlFor="name" className="form-label">Name</label>
           <input type="text" className="form-control" name="name" id="name" value={credentials.name} onChange={onChange} aria-describedby="emailHelp" placeholder="Your Full Name" required />
            
          </div>
         <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange}  aria-describedby="emailHelp" placeholder="name@example.com" required />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="Password" className="form-label">Password</label>
          <div className="input-group">
            <input type={showPassword ? "text" : "password"} className="form-control" id="Password" name="password" value={credentials.password} onChange={onChange} minLength={5} required placeholder="At least 5 characters" />
            <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)} title={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
          <div id="passwordHelp" className="form-text">We'll never share your password with anyone else.</div>
        </div>
       <div className="mb-4">
         <label htmlFor="cPassword" className="form-label">Confirm Password</label>
         <div className="input-group">
           <input type={showCPassword ? "text" : "password"} className="form-control" id="cPassword"  name="cpassword" value={credentials.cpassword} onChange={onChange} minLength={5} required placeholder="Confirm your password" />
           <button className="btn btn-outline-secondary" type="button" onClick={() => setShowCPassword(!showCPassword)} title={showCPassword ? "Hide password" : "Show password"}>
             {showCPassword ? "👁️" : "🙈"}
           </button>
         </div>
       </div>

        <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
          {loading ? (
            <span>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Creating Account...
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
      <div className="text-center mt-3 pt-3 border-top">
        <span className="text-muted small">Already have an account? </span>
        <Link to="/login" className="fw-semibold text-decoration-none">Login</Link>
      </div>
    </div>
  </div>
  )
}

export default Signup
