import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react"; // icons
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { logout } from "../redux/authSlice";
import toast from "react-hot-toast";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(logout());
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout!");
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          BookSwap
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 font-medium items-center">
          <Link to="/booklist" className="hover:text-yellow-300">
            Book List
          </Link>
          <Link to="/addbook" className="hover:text-yellow-300">
            Add Book
          </Link>
          <Link to="/bookrequest" className="hover:text-yellow-300">
            Manage Request
          </Link>

          {/* User Email */}
          {user?.email && (
            <span className="ml-4 font-medium text-sm">{user.email}</span>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 hover:text-yellow-300"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>

        {/* Right Side - Profile Icon & Mobile Hamburger */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link to="/profile">
            <User className="w-6 h-6 cursor-pointer hover:text-yellow-300" />
          </Link>

          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-3 space-y-3">
          <Link
            to="/booklist"
            className="block hover:text-yellow-300"
            onClick={() => setIsOpen(false)}
          >
            Book List
          </Link>
          <Link
            to="/addbook"
            className="block hover:text-yellow-300"
            onClick={() => setIsOpen(false)}
          >
            Add Book
          </Link>
          <Link
            to="/bookrequest"
            className="block hover:text-yellow-300"
            onClick={() => setIsOpen(false)}
          >
            Manage Request
          </Link>

          {/* User Email */}
          {user?.email && <span className="block text-sm">{user.email}</span>}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 hover:text-yellow-300"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
