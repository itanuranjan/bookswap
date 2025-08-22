function Footer() {
    return (
      <footer className="bg-gray-800 text-gray-200 py-6 mt-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          {/* Left */}
          <p className="text-sm">&copy; {new Date().getFullYear()} BookSwap Marketplace. All rights reserved.</p>
  
          {/* Right */}
          <div className="flex space-x-4 mt-3 md:mt-0">
            <a href="/about" className="hover:text-white">About</a>
            <a href="/contact" className="hover:text-white">Contact</a>
            <a href="/privacy" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  