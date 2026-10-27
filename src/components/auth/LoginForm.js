import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/actions/authActions";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = dispatch(loginUser(email, password));

    if (!result?.success) {
      setError(result?.message || "Login failed. Please try again.");
      return;
    }

    const destination = location.state?.from?.pathname || "/";
    navigate(destination, { replace: true });
  };

  return (
    <section className="login-form-section">
      <h2>Welcome Back</h2>
      <p>Sign in to your Farm Management account.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email Address</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </section>
  );
}