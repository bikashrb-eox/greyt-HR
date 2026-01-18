import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./AuthModal.module.css";

export default function AuthModal({ onClose }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        setSuccess("Login successful");
        // Redirect to home page after successful login
        setTimeout(() => {
          onClose();
          navigate("/home");
        }, 1200);
        return;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (error) {
          console.error("Signup error details:", {
            message: error.message,
            status: error.status,
            error: error,
          });
          throw error;
        }

        // Check if email confirmation is required
        if (data?.user && !data?.session) {
          setSuccess("Registration successful! Please check your email to confirm your account.");
        } else {
          setSuccess("Registration successful. Please login.");
        }
      }

      // For signup, just close the modal
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      console.error("Auth error:", err);
      
      // Provide more helpful error messages
      let errorMessage = err?.message || "An error occurred";
      
      if (err?.message?.includes("Database error")) {
        errorMessage = "Database configuration error. Please check your Supabase database setup. " +
          "You may need to disable triggers or create missing tables/functions in your Supabase project.";
      } else if (err?.status === 500) {
        errorMessage = "Server error during signup. This usually indicates a database trigger or function is failing. " +
          "Check your Supabase dashboard for database logs and ensure all required tables and triggers are properly configured.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.title}>
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <p className={styles.subtitle}>
          {mode === "login"
            ? "Sign in to continue"
            : "Register to get started"}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className={styles.primaryBtn}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Register"}
          </button>
        </form>

        {/* FEEDBACK AREA (NO LAYOUT SHIFT) */}
        <div className={styles.feedback}>
          {error && <span className={styles.error}>{error}</span>}
          {success && <span className={styles.success}>{success}</span>}
        </div>

        <div className={styles.switch}>
          {mode === "login" ? (
            <>
              New user?
              <span onClick={() => setMode("signup")}> Register</span>
            </>
          ) : (
            <>
              Already have an account?
              <span onClick={() => setMode("login")}> Sign In</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
