import React from "react";

const Footer = () => {
  return (
    <footer className="footer p-10">
      <div>
        <span className="footer-title">Services</span>
        <a href="#" className="link link-hover">
          Branding
        </a>
        <a href="#" className="link link-hover">
          Design
        </a>
        <a href="#" className="link link-hover">
          Marketing
        </a>
        <a href="#" className="link link-hover">
          Advertisement
        </a>
      </div>
      <div>
        <span className="footer-title">Company</span>
        <a href="#" className="link link-hover">
          About us
        </a>
        <a href="#" className="link link-hover">
          Contact
        </a>
        <a href="#" className="link link-hover">
          Jobs
        </a>
        <a href="#" className="link link-hover">
          Press kit
        </a>
      </div>
      <div>
        <span className="footer-title">Legal</span>
        <a href="#" className="link link-hover">
          Terms of use
        </a>
        <a href="#" className="link link-hover">
          Privacy policy
        </a>
        <a href="#" className="link link-hover">
          Cookie policy
        </a>
      </div>
      <div>
        <span className="footer-title">Newsletter</span>
        <div className="form-control w-80">
          <label className="label">
            <span className="label-text">Enter your email address</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="username@site.com"
              className="input input-bordered w-full pr-16"
            />
            <button className="btn btn-square absolute top-0 right-0 rounded-l-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
