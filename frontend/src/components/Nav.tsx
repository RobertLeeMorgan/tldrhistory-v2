import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { RomanHelmet, UserIcon } from "../icons/icons";
import { motion } from "framer-motion";

export default function Nav() {
  const { isAuth, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const isProfile = location.pathname === `/user/${isAuth.id}`;

  async function handleLogout() {
    try {
      logout();
      addToast({
        message: "You are logged out, bye for now!",
        type: "info",
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav className="navbar fixed top-0 z-50 w-full px-4 md:px-8">
      <div className="flex justify-between w-full">
        {/* Left: title */}
        <div className={`navbar-start ${isHome ? "hidden lg:block" : "block"}`}>
          <Link to="/" className="btn btn-ghost text-xl" aria-label="home">
            TLDR History
          </Link>
        </div>

        <div className="flex-1 lg:hidden"></div>

        {/* Right: avatar/profile */}
        <div className="navbar-end flex items-center">
          <div className="dropdown dropdown-end pr-0 md:pr-6">
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle w-12 h-12 md:w-16 md:h-16 avatar"
                aria-label="user menu"
              >
                <div className="text-accent place-items-center w-8 h-8 md:w-12 md:h-12">
                  {isAuth.token ? <RomanHelmet /> : <UserIcon />}
                </div>
              </div>
            </motion.div>
            <ul
              tabIndex={0}
              className="mt-3 z-50 p-2 shadow opacity-100 menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              {isAuth.token ? (
                <>
                  <li className={`${isProfile ? "hidden" : "block"}`}>
                    <Link to={`/user/${isAuth.id}`}>Profile</Link>
                  </li>
                  <li
                    className={`${
                      isAuth.role === "ADMIN" || isAuth.role === "MODERATOR"
                        ? "block"
                        : "hidden"
                    }`}
                  >
                    <Link
                      to={`/review-suggestions`}
                      aria-label="review suggestions"
                    >
                      Review Suggestions
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} aria-label="logout">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className={`${isLogin ? "hidden" : "block"}`}>
                    <Link to="/login" aria-label="login">
                      Login
                    </Link>
                  </li>
                  <li className={`${isRegister ? "hidden" : "block"}`}>
                    <Link to="/register" aria-label="register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
