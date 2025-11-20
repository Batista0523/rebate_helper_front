import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const page: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.06 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.2, 0.8, 0.2, 1] } },
};

const popCard: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120, damping: 16 } },
};

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      className="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary"
      variants={page}
      initial="hidden"
      animate="show"
    >
      <div className="container">
        <div className="row justify-content-center">
          <motion.div variants={rise} className="col-12 text-center mb-4">
            <div className="fw-bold fs-5">Batistack</div>
            <div className="text-secondary">Clean Heat Rebate Portal</div>
          </motion.div>

          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <motion.div variants={popCard} className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">
                <motion.h1 variants={rise} className="h4 fw-semibold mb-1 text-center">
                  Sign in
                </motion.h1>
                <motion.p variants={rise} className="text-secondary text-center mb-4">
                  Welcome back. Enter your credentials to continue.
                </motion.p>

                {error ? (
                  <motion.div
                    variants={rise}
                    className="alert alert-danger d-flex align-items-center"
                    role="alert"
                  >
                    <span className="me-2">⚠️</span>
                    <span>{error}</span>
                  </motion.div>
                ) : null}

                <motion.form
                  variants={rise}
                  className="needs-validation"
                  noValidate
                  onSubmit={handleLogin}
                >
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className={`form-control ${error ? "is-invalid" : ""}`}
                      id="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      autoFocus
                    />
                    <label htmlFor="email">Email</label>
                    <div className="invalid-feedback">Please check your email.</div>
                  </div>

                  <div className="input-group mb-3">
                    <div className="form-floating flex-grow-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        id="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="current-password"
                      />
                      <label htmlFor="password">Password</label>
                      <div className="invalid-feedback">Minimum 6 characters.</div>
                    </div>
                    <motion.button
                      type="button"
                      className="btn btn-outline-secondary"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </motion.button>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="remember" />
                      <label className="form-check-label" htmlFor="remember">Remember me</label>
                    </div>
                    <a className="link-secondary small" href="#">Forgot password?</a>
                  </div>

                  <motion.button
                    type="submit"
                    className="btn btn-primary fw-semibold w-100 py-2 d-inline-flex justify-content-center align-items-center"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading && (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    )}
                    {loading ? "Signing in..." : "Sign in"}
                  </motion.button>

                  <div className="text-center mt-4 small text-secondary">
                    No account? <a className="link-primary" href="/register">Create one</a>
                  </div>
                </motion.form>
              </div>
              <div className="card-footer bg-body-tertiary text-center small text-secondary">
                © {new Date().getFullYear()} Batistack Development
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

export default Login;
