import { useState, useEffect } from "react";
import {
  LuMenu,
  LuX,
  LuMoon,
  LuSun,
  LuHome,
  LuGift,
  LuUser,
  LuLogOut,
  LuChevronDown,
} from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/features/authSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
    setIsProfileDropdownOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  const links = [
    { path: "/", label: "Home", icon: <LuHome className="h-5 w-5" /> },
    { path: "/offers", label: "Offers", icon: <LuGift className="h-5 w-5" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${
        isScrolled ? "bg-base-100/95 backdrop-blur-md shadow-md" : "bg-base-100"
      }
    `}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              EstateEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center space-x-2 px-2 py-1 rounded-lg
                  transition-colors duration-200
                  ${
                    isActive(path)
                      ? "text-primary font-medium bg-primary/10"
                      : "hover:text-primary hover:bg-primary/5"
                  }
                `}
              >
                {icon}
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <LuSun className="h-5 w-5" />
              ) : (
                <LuMoon className="h-5 w-5" />
              )}
            </button>

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-2 btn btn-ghost btn-sm"
                >
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                      <span className="text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className="hidden md:inline">{user.name}</span>
                  <LuChevronDown className="h-4 w-4" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg py-1 border border-base-300">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 hover:bg-base-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <LuUser className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 hover:bg-base-200 text-error"
                    >
                      <LuLogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/sign-in" className="btn btn-primary btn-sm">
                <LuUser className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn-ghost btn-circle btn-sm md:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <LuX className="h-5 w-5" />
              ) : (
                <LuMenu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {links.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center space-x-2 p-2 rounded-lg
                    transition-colors duration-200
                    ${
                      isActive(path)
                        ? "text-primary font-medium bg-primary/10"
                        : "hover:text-primary hover:bg-primary/5"
                    }
                  `}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
