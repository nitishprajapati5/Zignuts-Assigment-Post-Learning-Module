import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axios";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null); 

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await axiosInstance.post("/api/me", {}, { withCredentials: true });
        
        if (res.status === 200) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthorized(false);
      }
    }
    checkAuth();
  }, []);


  if (isAuthorized === false) {
    navigate("/");
    return null; 
  }

  return <>{children}</>;
}