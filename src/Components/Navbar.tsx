import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link px-3 ${isActive ? "active fw-semibold text-info" : "text-light"}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm border-bottom border-secondary">
      <div className="container-fluid px-4">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/"
        >
          Batistack
          <span className="badge bg-info text-dark">Clean Heat</span>
          <span className="text-secondary">Rebate Portal</span>
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
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className={navLinkClass}>
                    Log in
                  </NavLink>
                </li>

                <li className="nav-item ms-lg-2">
                  <NavLink to="/register" className="btn btn-outline-info px-3">
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item d-none d-lg-block me-2">
                  <span className="navbar-text text-secondary small">
                    Signed in as{" "}
                    <strong className="text-light">{user?.name}</strong>
                  </span>
                </li>

                {/* <li className="nav-item">
                  <NavLink to="/clients" className={navLinkClass}>
                    Clients
                  </NavLink>
                </li> */}

                <li className="nav-item">
                  <NavLink to="/applications_pages" className={navLinkClass}>
                    Applications
                  </NavLink>
                </li>

                <li className="nav-item d-none d-lg-block mx-2">
                  <span className="text-secondary">|</span>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm px-3"
                    onClick={handleSignOut}
                  >
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
