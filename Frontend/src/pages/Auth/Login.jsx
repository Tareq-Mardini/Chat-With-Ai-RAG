import { useForm } from "react-hook-form";
import { loginUser } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import "../../styles/Auth.css";
import galaxy from "../../videos/galaxy.mp4";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await loginUser(data);
      localStorage.setItem("token", res.data.data.token);
      navigate("/Dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      setValue("password", "");
    }
  };

  return (
    <div style={{ padding: 0 }} className="auth-wrapper">
      <video autoPlay muted loop playsInline className="background-video">
        <source src={galaxy} type="video/mp4" />
      </video>
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">
          Enter your credentials to access your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
                maxLength: {
                  value: 255,
                  message: "Email is too long",
                },
              })}
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>{" "}
          <h3
            style={{
              fontSize: "15px",
              color: "red",
              textAlign: "center",
              fontWeight: "normal",
            }}
          >
            {error}
          </h3>
        </form>

        <p className="switch">
          Don’t have an account? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}
