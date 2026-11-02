import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 my-4">
      <div style={{ fontSize: "4.5rem", lineHeight: "1" }}>🔍</div>
      <h1 className="fw-bold mt-3 display-6">404 - Page Not Found</h1>
      <p className="text-muted mt-2 mb-4" style={{ maxWidth: "480px" }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary px-4 py-2 shadow-sm">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;

