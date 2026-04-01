import { useForm } from "react-hook-form";
import { registerUser } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import "../../styles/Auth.css";
import galaxy from "../../videos/galaxy.mp4";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await registerUser(data);
      localStorage.setItem("token", res.data.data.token);
      navigate("/Dashboard");
    } catch (err) {
      setError(
        Object.values(err.response?.data?.errors || {})[0] ||
          "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <video autoPlay muted loop playsInline className="background-video">
        <source src={galaxy} type="video/mp4" />
      </video>
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="subtitle">Start your journey with us today</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Full name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Name cannot exceed 100 characters",
                },
              })}
            />
            {errors.name && <span>{errors.name.message}</span>}
          </div>

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
                  message: "Email cannot exceed 255 characters",
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
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm password"
              {...register("password_confirmation", {
                required: "Please confirm your password",
                validate: (value, formValues) =>
                  value === formValues.password || "Passwords do not match",
              })}
            />
            {errors.password_confirmation && (
              <span>{errors.password_confirmation.message}</span>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
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
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
