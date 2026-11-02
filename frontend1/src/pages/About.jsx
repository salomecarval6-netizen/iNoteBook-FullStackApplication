const About = () => {

  /*
   const a=useContext(NoteContext);
 
   useEffect(()=>{
     a.update();
   },[])
   */

  //<div>This is About {a.state.name} </div>
  return (
    <>
      <style>{`
        .about-section {
          padding: 20px 0 40px 0;
        }

        .about-badge {
          display: inline-block;
          background-color: #eef2ff;
          color: #4f46e5;
          border: 1px solid #c7d2fe;
          border-radius: 20px;
          padding: 5px 16px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 14px;
          letter-spacing: 0.3px;
        }

        .about-title {
          font-size: 36px;
          font-weight: 800;
          color: #1e1b4b;
          letter-spacing: -0.5px;
          margin-bottom: 12px;
        }

        .about-subtitle {
          font-size: 16px;
          color: #64748b;
          line-height: 1.6;
          max-width: 620px;
          margin: 0 auto;
        }

        .about-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 36px 24px;
          text-align: center;
          height: 100%;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .about-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.09);
          border-color: #cbd5e1;
        }

        .about-icon-badge {
          width: 62px;
          height: 62px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 20px;
        }

        .badge-security {
          background-color: #eef2ff;
          border: 1px solid #c7d2fe;
        }

        .badge-organization {
          background-color: #fffbeb;
          border: 1px solid #fde68a;
        }

        .badge-device {
          background-color: #ecfdf5;
          border: 1px solid #a7f3d0;
        }

        .about-card-title {
          font-size: 19px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 10px;
          letter-spacing: -0.2px;
        }

        .about-card-text {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 0;
        }

        .about-footer-banner {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 26px 30px;
          margin-top: 36px;
          text-align: center;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
        }

        .about-footer-banner-title {
          font-size: 17px;
          font-weight: 700;
          color: #1e1b4b;
          margin-bottom: 6px;
        }

        .about-footer-banner-text {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .about-title {
            font-size: 28px;
          }
          .about-card {
            padding: 28px 20px;
          }
        }
      `}</style>

      <div className="container about-section">
        <div className="text-center my-4">
          <span className="about-badge">About iNotebook</span>
          <h1 className="about-title">Save Your Own Notes</h1>
          <p className="about-subtitle">
            iNotebook is your personal cloud-based digital notebook designed to make capturing and organizing thoughts intuitive, secure, and accessible from any device.
          </p>
        </div>

        <div className="row g-4 my-3 justify-content-center">
          <div className="col-12 col-md-4">
            <div className="about-card">
              <div className="about-icon-badge badge-security">🔒</div>
              <h5 className="about-card-title">Privacy &amp; Security</h5>
              <p className="about-card-text">
                Your notes are tied exclusively to your authenticated account with modern token verification.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="about-card">
              <div className="about-icon-badge badge-organization">⚡</div>
              <h5 className="about-card-title">Real-Time Organization</h5>
              <p className="about-card-text">
                Add, edit, and organize notes dynamically with custom tags and instantaneous updates.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="about-card">
              <div className="about-icon-badge badge-device">📱</div>
              <h5 className="about-card-title">Multi-Device Friendly</h5>
              <p className="about-card-text">
                Seamless responsive layout whether you are working on desktop, tablet, or smartphone.
              </p>
            </div>
          </div>
        </div>

        <div className="about-footer-banner">
          <div className="about-footer-banner-title">Simple, Secure &amp; Always Accessible</div>
          <p className="about-footer-banner-text">
            Designed to help you keep every thought, task, and reminder neatly stored in one safe place.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;

//is a View Component that represents an individual webpage in your application
