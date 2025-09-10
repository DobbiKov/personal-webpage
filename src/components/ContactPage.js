import React from "react";
import "./ContactPage.css";
import Header from "./Header";

const ContactPage = () => {
  return (
    <div className="lect_notes_main_cont">
      <Header active={"contact_me"}/>
      <div className="lect_notes_main_cont_inner">
        <div className="contact-page">
          <h1>Contact Me</h1>
          <p className="contact-description">
            Feel free to reach out to me through any of the following channels:
          </p>

          {/* Contact Details */}
          <div className="contact-details">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <p>Email: <a href="mailto:yehor.korotenko@outlook.com">yehor.korotenko@outlook.com</a></p>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <p>Email: <a href="mailto:yehor.korotenko@universite-paris-saclay.fr">yehor.korotenko@universite-paris-saclay.fr</a></p>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <p>Telegram: <a href="https://t.me/dobbikov">dobbikov</a></p>
            </div>
          </div>

          {/* Social Links */}
          <div className="social-links">
            <h3>Connect with Me</h3>
            <div className="icons">
              <a href="https://github.com/DobbiKov" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://linkedin.com/in/yehor-korotenko" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="mailto:yehor.korotenko@outlook.com">
                <i className="fas fa-envelope"></i>
              </a>
              <a href="https://instagram.com/dobbikov" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;