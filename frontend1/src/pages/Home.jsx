import { Link } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
const Home = (props) => {


  return (
    <div className="container">

    <section id='head' className="my-5">
      <div className="hero-pill-badge">✨ Secure Cloud Notes Platform</div>
      <div className="card-header">
      <h5>iNotebook</h5>
      </div>
      <div className="card-body">
      <figure>
        <blockquote className="blockquote">
          <p> Your Notes..Your Ideas..Your Space.. </p>
        </blockquote>
        <figcaption className="blockquote-footer">
        Capture your thoughts<cite title="Source Title"> with iNotebook</cite>
        </figcaption>
      </figure>
      </div>
      <div className="mt-4">
        <Link to={localStorage.getItem('token') ? '/dashboard' : '/signup'} className="btn btn-primary px-4 py-2 fs-6">
          <span>{localStorage.getItem('token') ? 'Go to Dashboard' : 'Get Started'}</span>
          <span>→</span>
        </Link>
      </div>
    </section>

    <div className="text-center mb-5">
      <span className="badge rounded-pill px-3 py-2 mb-2 fw-semibold" style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary-border)' }}>Platform Features</span>
      <h3 className='fw-bold fs-2 mb-2'>Why iNotebook ?</h3>
      <p className="text-muted mx-auto" style={{ maxWidth: '520px' }}>
        A modern, distraction-free notes application built to keep your thoughts organized, accessible, and protected.
      </p>
    </div>

    <section id='main' className="row g-4 justify-content-center">
      <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
        <div className="card feature-card h-100">
          <div className="feature-img-wrapper">
            <img src="/edit.webp" className="card-img-top feature-img" alt="Create and Edit" />
          </div>
          <div className="card-body">
            <div className="feature-icon-badge">✍️</div>
            <h5 className="card-title">Create and Edit</h5>
            <p className="card-text">Easily create, update and manage your personal notes whenever you need. </p>
          </div>
        </div>
      </div>
    
      <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
        <div className="card feature-card h-100">
          <div className="feature-img-wrapper">
            <img src="/secure.png" className="card-img-top feature-img" alt="Secure" />
          </div>
          <div className="card-body">
            <div className="feature-icon-badge">🔒</div>
            <h5 className="card-title">Secure</h5>
            <p className="card-text"> Your notes are protected and accessible only through your authenticated account.</p>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
        <div className="card feature-card h-100">
          <div className="feature-img-wrapper">
            <img src="/access.jpg" className="card-img-top feature-img" alt="Easy to access" />
          </div>
          <div className="card-body">
            <div className="feature-icon-badge">⚡</div>
            <h5 className="card-title">Easy to access</h5>
            <p className="card-text"> Access and manage your notes easily from your iNotebook application. </p>
          </div>
        </div>
      </div>
    </section>
  </div>
  )
}

export default Home;
