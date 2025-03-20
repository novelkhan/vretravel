import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-top border-primary mt-5">
      <div className="mt-2 text-center">
        <h6>Copyright &copy; {currentYear} <a className="link">Unique Travels</a></h6>
      </div>
    </footer>
  );
};

export default Footer;