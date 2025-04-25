import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { login } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    try {
      const { credential } = response; // Google Token
      //console.log("Google Token:", credential);

      // Get backend URL from environment variable
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL
      let backendUrl = 'http://localhost:8081'
      if (API_URL) {
        try {
          const url = new URL(API_URL)
          backendUrl = `${url.protocol}//${url.host}`
        } catch (e) {
          // Fallback: remove /v1 if present
          backendUrl = API_URL.replace('/v1', '').replace(/\/$/, '')
        }
      }

      // Send token to backend
      const { data } = await axios.post(`${backendUrl}/auth/google`, {
        token: credential,
      }, {
        withCredentials: true,
      });

      //console.log("Backend Response:", data);
      //console.log("User:", data.user);

      // Dispatch user data to Redux store
      dispatch(login(data.user));

      // Store JWT token in localStorage
      localStorage.setItem("accessToken", data.accessToken); // FIXED: Correct key name

      // Redirect based on user role
      if (data.user?.role === "jobseeker") {
        navigate("/userhome");
      } else if (data.user?.role === "recruiter") {
        navigate("/recruiterhome");
      }

      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Google login failed. Please try again."
      toast.error(errorMessage);
    }
  };

  const handleFailure = (error) => {
    console.error("Google Login Failed:", error);
    toast.error("Google authentication failed.");
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </div>
  );
};

export default Login;
