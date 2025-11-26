import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const navigate = useNavigate();
  const { isAuth, logout } = useAuth();

  async function handleLogout() {
    try {
      logout();
      toast("You are logged out, bye for now!");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav
      className="navbar absolute top-0 p-0 m-0 z-50"
    >
      <div className="navbar-start md:ml-8"> 
        <Link to="/" className="btn btn-ghost text-xl">TLDR History</Link>
      </div>
      <div className="navbar-end md:mr-8">
        <ul className="menu menu-horizontal px-1">
          {isAuth.token && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle btn-lg avatar mx-8"
              >
                <div className="w-12 rounded-full">
                  <img alt="Profile picture" src="/genghis.webp" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-50 p-2 shadow opacity-100 menu menu-sm dropdown-content bg-base-100 rounded-box w-52 "
              >
                <li className="justify-between">
                  <Link to={`/user/${isAuth.id}`}>Profile</Link>
                </li>
                <li className="inline">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          )}
          {!isAuth.token && (
            <>
              <li className="inline text-lg">
                <Link to="/login">Login</Link>
              </li>
              <div className="divider divider-horizontal mx-0"></div>
              <li className="inline text-lg">
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
