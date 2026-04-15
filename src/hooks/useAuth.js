import { useNavigate } from "react-router-dom";

export function useAuth({ redirectTo = "/login" } = {}) {
  const navigate = useNavigate();

  let user = {};
  let jwt = null;
  try {
    jwt = localStorage.getItem("jwt");
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    // Incognito / SSR — graceful fallback
  }

  const isAuthenticated = Boolean(jwt);

  function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    navigate("/");
  }

  function requireAuth() {
    if (!isAuthenticated) {
      navigate(redirectTo);
      return false;
    }
    return true;
  }

  return { user, jwt, isAuthenticated, logout, requireAuth, navigate };
}
