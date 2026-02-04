import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Python Education Platform. Tous droits reserves.
            </p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="https://github.com/Djouldediallodalein" className="hover:text-primary-400 transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-primary-400 transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-primary-400 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
