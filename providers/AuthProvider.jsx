"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { account } from "@/lib/appwirte/client"
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
        const currentUser = await account.get()
        setUser(currentUser)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUserSession()
  }, [])

  const loginWithGoogle = async () => {
    try {
      setLoading(true)
      await account.createOAuth2Session(
        "google",
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/auth/failure`,
      )
      toast.success("Successfully logged in with Google!")
    } catch (error) {
      console.error("Login failed:", error)
      toast.error("Login failed. Please try again.")
      setLoading(false)
      throw error
    }
  }

  const logout = async () => {
    try {
      await account.deleteSession("current")
      setUser(null)
      toast.info("Logged out successfully.")
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed. Please try again.")
    }
  }

  const value = {
    user,
    loading,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
