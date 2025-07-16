"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { account } from "@/lib/appwrite"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
        // Optionally, if there's an error on /dashboard and no user, redirect to login
        // if (router.pathname !== "/") { // Assuming "/" is your login/landing
        //   router.push("/");
        // }
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);


  const loginWithGoogle = async () => {
    try {
      setLoading(true); // Set loading before authentication
      await account.createOAuth2Session(
        "google",
        `${window.location.origin}/dashboard`, // Successful login redirects here
        `${window.location.origin}/auth/failure` // Failed login redirects here (create this page)
      );
      // After successful OAuth, checkAuth will update user state
      toast.success("Successfully logged in with Google!");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
      setLoading(false); // Reset loading on error
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      toast.info("Logged out successfully.");
      router.push("/"); // Redirect to landing/login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    logout,
    // checkAuth function is called internally, no need to expose directly
    // but if you want to allow manual re-checking, you can expose it.
    // For now, let's keep it internal.
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}