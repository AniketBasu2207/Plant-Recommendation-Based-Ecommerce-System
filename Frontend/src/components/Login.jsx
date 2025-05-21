import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginerrtext, setloginerrtext] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setloginerrtext("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("loggedIn", "true");
        onLogin();
      } else {
        setloginerrtext(data.error || "Incorrect username or password");
      }
    } catch (error) {
      setloginerrtext("Login failed. Please try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setloginerrtext("");

    try {
      const response = await fetch("/api/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSignupSuccess(true);
        setTimeout(() => {
          setIsSignup(false);
          setSignupSuccess(false);
        }, 2000);
      } else {
        setloginerrtext(data.error || "Signup failed");
      }
    } catch (error) {
      setloginerrtext("Signup failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 body-bg-color">
      <div className="card shadow" style={{ width: "400px" }}>
        <div className="card-header text-center">
          <h4>{isSignup ? "Admin Signup" : "Admin Login"}</h4>
        </div>
        <div className="card-body">
          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <p className="text-center fw-bold text-danger">
                {loginerrtext ? loginerrtext : ""}
              </p>
              {signupSuccess && (
                <p className="text-center fw-bold text-success">
                  Signup successful! You can now login.
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-100">
              {isSignup ? "Sign Up" : "Login"}
            </button>
          </form>
        </div>
        <div className="card-footer text-center">
          <small>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsSignup(!isSignup);
                setloginerrtext("");
                setSignupSuccess(false);
              }}
            >
              {isSignup ? "Login" : "Sign Up"}
            </a>
          </small>
          <br />
          <small>
            <a href="#">Forgot your password?</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
