import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Batistack <span className="text-info">Clean Heat</span> Rebate Portal
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active fw-semibold" : "")
                    }
                  >
                    Log in
                  </NavLink>
                </li>
                <li className="nav-item ms-lg-2">
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      "btn btn-outline-info ms-lg-1" + (isActive ? " active" : "")
                    }
                  >
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2 d-none d-lg-block">
                  <span className="navbar-text text-secondary small">
                    {user?.name}
                  </span>
                </li>
                   <NavLink
                    to="/clients"
                    className="navbar-text text-secondary small"
                  >
                    Clients
                  </NavLink>
                 
                   <NavLink
                    to="/applications_pages"
                    className="navbar-text text-secondary small"
                  >
                    Applications
                  </NavLink>
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={handleSignOut}>
                    Sign out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
