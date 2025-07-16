"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { account } from "@/lib/appwrite"
import { useRouter } from "next/navigation"

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
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const session = await account.get()
      setUser(session)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      await account.createOAuth2Session(
        "google",
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/auth/failure`,
      )
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await account.deleteSession("current")
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const value = {
    user,
    loading,
    loginWithGoogle,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
