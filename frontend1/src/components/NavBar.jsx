import { useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NoteContext from '../context/notes/noteContext.jsx';
import AuthContext from '../context/AuthContext.jsx';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Stack from '@mui/material/Stack';

//use of uselocation hook
//useLocation: This is a tool provided by React Router that acts like a GPS for your application. It constantly looks at the browser's address bar to see what URL path the user is currently visiting.
const NavBar = () => {
  // 1. Grab user data and fetch tool from Context
  const context = useContext(NoteContext);
  const { user, getUserDetails, setNotes, setUser } = context;
  const { token, logout } = useContext(AuthContext);



  let location = useLocation();
  //location that holds information about the current web address

  //useEffect runs code every time dependencies change.  
  useEffect(() => {
    if (localStorage.getItem('token') && !user) {
      getUserDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);//[location] ensures this check triggers every single time the user clicks a new page path
  //useEffect with [location]: This tells React to wake up and run a check every single time the user clicks a link and switches to a new URL path

  const navigate = useNavigate();

  const handleLogout = () => {
    //1. delete the authentication token, wiping out the active login session. So that next time curr users token is stored
    logout();
    // 2. CLEAR REACT STATE: Reset notes to empty so the next user doesn't see them
    setNotes([]);
    // 3. Clear user details state (if you have one)
    setUser(null);
    //4. Redirect to login page
    navigate('/login');
  }

  const viewDetails = async () => {
    // 1. Force context to go look up the data from MongoDB
    await getUserDetails();

    // 2. Read the resolved data out of the context 
    /* (User Account Details are displayed cleanly inside the #userProfileModal dialog) */
  };



  return (
    <>
      {/*Always take help of this key factor that whenever a user is logged in a token exist so this condition can be used to toggle */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)', boxShadow: '0 4px 20px -2px rgba(30, 27, 75, 0.25)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Toolbar sx={{ py: 0.5, flexWrap: 'wrap', gap: 1 }}>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Link to='/' style={{ color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem' }}>📓</span>
                <span>INoteBook</span>
              </Link>
              <Link to='/about' style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '4px 10px', borderRadius: '6px', backgroundColor: location.pathname === '/about' ? 'rgba(255, 255, 255, 0.2)' : 'transparent', opacity: location.pathname === '/about' ? 1 : 0.85, border: '1px solid rgba(255, 255, 255, 0.25)' }}>
                About
              </Link>
            </Typography>


            {!token ? (
              // Case A: If NO token exists means no one is yet registered so display the login links
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/*Every React component or conditional block has a strict rule: It must return exactly ONE single parent element.Thus react fragments are used */}
                <Link to='/login' variant="contained" style={{ color: "white", padding: '6px 14px', textDecoration: 'none', cursor: 'pointer', borderRadius: '8px', fontSize: '0.925rem', fontWeight: 500, transition: 'all 0.2s ease', backgroundColor: location.pathname === '/login' ? 'rgba(255, 255, 255, 0.18)' : 'transparent', border: '1px solid rgba(255, 255, 255, 0.25)' }}>Login</Link>
                <Link to='/signup' variant="contained" style={{ color: "white", padding: '6px 14px', textDecoration: 'none', cursor: 'pointer', borderRadius: '8px', fontSize: '0.925rem', fontWeight: 500, transition: 'all 0.2s ease', backgroundColor: location.pathname === '/signup' ? 'rgba(255, 255, 255, 0.18)' : 'transparent', border: '1px solid rgba(255, 255, 255, 0.25)' }}>SignUp</Link>
              </Box>
            ) : (
              //Case B: If a token DOES exist means user has logged in then display the Dashboard/Logout link
              <>
                <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} sx={{ flexWrap: 'wrap', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
                  <Link to='/dashboard' style={{ color: "white", padding: '6px 14px', textDecoration: 'none', cursor: 'pointer', borderRadius: '8px', fontSize: '0.925rem', fontWeight: 500, transition: 'all 0.2s ease', backgroundColor: location.pathname === '/dashboard' ? 'rgba(255, 255, 255, 0.18)' : 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)' }}>Dashboard</Link>
                  {/*can write any standard CSS styling inside sx that you would normally write inside a regular React style={{ }} block. */}
                  <Button variant="outlined" sx={{ color: "white", cursor: 'pointer', textTransform: 'none', borderColor: 'rgba(255, 255, 255, 0.35)', borderRadius: '8px', px: 1.5, py: 0.5, fontSize: '0.875rem', fontWeight: 500, '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.12)' } }} onClick={viewDetails} data-bs-toggle="modal" data-bs-target="#userProfileModal">View User Details</Button>
                  <Button variant="outlined" sx={{ color: "white", cursor: 'pointer', textTransform: 'none', borderColor: 'rgba(239, 68, 68, 0.6)', backgroundColor: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', px: 1.5, py: 0.5, fontSize: '0.875rem', fontWeight: 500, '&:hover': { borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.3)' } }} onClick={handleLogout}>Logout</Button>
                </Stack>
              </>
            )}

          </Toolbar>
        </AppBar>
      </Box>

      {/* User Account Details Modal */}
      <div className="modal fade" id="userProfileModal" tabIndex="-1" aria-labelledby="userProfileModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="userProfileModalLabel">
                <span>👤</span> User Account Details
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center py-4">
              {user ? (
                <div>
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center text-primary fw-bold"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'var(--primary-light)',
                      fontSize: '1.8rem',
                      border: '2px solid var(--primary-border)'
                    }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <h4 className="fw-bold mb-1 text-dark">{user.name}</h4>
                  <p className="text-muted small mb-3">{user.email}</p>

                  <div className="bg-light p-3 rounded-3 text-start small border">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Account ID:</span>
                      <span className="font-monospace text-secondary">{user._id || user.id || 'N/A'}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-0">
                      <span className="text-muted">Member Since:</span>
                      <span className="text-secondary">
                        {user.date ? new Date(user.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Active User'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-3 text-muted">
                  <p className="mb-0">Unable to load details. Please log in again.</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary px-3" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default NavBar;
