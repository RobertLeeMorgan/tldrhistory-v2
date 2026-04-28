import { Link, useNavigate, useLocation } from "react-router";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { RomanHelmet, UserIcon } from "../../icons/icons";
import { motion } from "framer-motion";

export default function Nav() {
  const { isAuth, logout, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

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
      navigate("/timeline");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav className="navbar fixed top-0 z-40 w-full p-2 sm:p-4 md:p-6 pointer-events-none">
      <div className="flex justify-between w-full md:px-6">
        {/* Left: title */}
        <div className="navbar-start text-stone-700">
          <Link
            to="/timeline"
            aria-label="timeline"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 flex place-content-center items-center rounded-full cursor-pointer pointer-events-auto"
          >
            <img
              src="/tldr-logo-512.png"
              alt="TLDR History logo"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 flex place-content-center items-center justify-center hover:bg-stone-900 rounded-full transition-colors duration-300"
            />
          </Link>
        </div>

        <div className="flex-1 lg:hidden"></div>

        {/* Right: avatar/profile */}
        <div className="navbar-end flex items-center">
          <div className="dropdown dropdown-end">
            {loading ? (
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-gold "></span>
              </div>
            ) : (
              <motion.div
                whileHover={{
                  scale: 1.05,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle w-12 h-12 md:w-18 md:h-18 avatar hover:bg-stone-950 transition-colors duration-300 cursor-pointer pointer-events-auto"
                  aria-label="user menu"
                >
                  <div className="text-gold place-items-center w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14">
                    {isAuth.token ? <RomanHelmet /> : <UserIcon />}
                  </div>
                </div>
              </motion.div>
            )}

            {!loading && (
              <ul
                tabIndex={0}
                className="mt-3 z-50 p-2 shadow opacity-100 menu menu-sm dropdown-content bg-stone-950/80 backdrop-blur-md rounded-box w-52 cursor-pointer pointer-events-auto"
              >
                {isAuth.token ? (
                  <>
                    <li className={`${isProfile ? "hidden" : "block"} `}>
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
                    <li
                      className={`${
                        isAuth.role === "ADMIN" ||
                        isAuth.role === "MODERATOR" ||
                        isAuth.role === "USER"
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      <Link to="/articles/create" aria-label="Create Article">
                        Create Article
                      </Link>
                    </li>
                    <li>
                      <Link to="/terms" aria-label="Terms">
                        Terms
                      </Link>
                    </li>
                    <li>
                      <Link to="/privacy" aria-label="Privacy">
                        Privacy
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
                    <li>
                      <Link to="/terms" aria-label="Terms">
                        Terms
                      </Link>
                    </li>
                    <li>
                      <Link to="/privacy" aria-label="Privacy">
                        Privacy
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
