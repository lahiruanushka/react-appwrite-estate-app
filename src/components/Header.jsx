import { LuMenu, LuMoon, LuSun, LuHome, LuGift, LuUser } from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/features/authSlice";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  const toggleTheme = () => {
    document.documentElement.setAttribute(
      "data-theme",
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark"
    );
  };

  const isActive = (path) => location.pathname === path;

  const getLinkClasses = (path) => {
    return `hover:text-primary transition-colors relative ${
      isActive(path)
        ? "text-primary font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:transition-width after:duration-300 after:ease-in-out"
        : ""
    }`;
  };

  const getMobileLinkClasses = (path) =>
    isActive(path) ? "bg-primary/10 text-primary font-semibold" : "";

  const links = [
    { path: "/", label: "Home", icon: <LuHome className="h-5 w-5 mr-2" /> },
    {
      path: "/offers",
      label: "Offers",
      icon: <LuGift className="h-5 w-5 mr-2" />,
    },
  ];

  return (
    <div className="navbar bg-base-100 shadow-xl">
      {/* Logo Section */}
      <div className="navbar-start">
        <div className="dropdown">
          {/* Mobile Menu Button */}
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <LuMenu className="h-5 w-5" />
          </label>
          {/* Mobile Menu Items */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {links.map(({ path, label, icon }) => (
              <li key={path} className={getMobileLinkClasses(path)}>
                <Link to={path}>
                  {icon}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          <span className="font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            EstateEase
          </span>
        </Link>
      </div>

      {/* Desktop Menu Items */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {links.map(({ path, label, icon }) => (
            <li key={path}>
              <Link to={path} className={getLinkClasses(path)}>
                {icon}
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side Items */}
      <div className="navbar-end gap-2">
        {/* Theme Toggle */}
        <label className="swap swap-rotate btn btn-ghost btn-circle">
          <input type="checkbox" onClick={toggleTheme} className="hidden" />
          <LuSun className="swap-on h-5 w-5" />
          <LuMoon className="swap-off h-5 w-5" />
        </label>

        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              className="text-sm text-gray-600 dark:text-gray-300 font-medium cursor-pointer"
            >
              Welcome, <span className="text-primary font-semibold">{user.name}</span>!
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-outline btn-primary btn-sm ml-2"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Sign In Button */}
            <Link
              to="/sign-in"
              className={`btn btn-primary ${
                isActive("/sign-in") ? "btn-active" : ""
              }`}
            >
              <LuUser className="h-5 w-5 mr-2" />
              Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
