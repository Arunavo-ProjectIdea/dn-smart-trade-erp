"use client"
import { createContext, useContext } from "react"
import { User } from "@/lib/auth"

const AuthContext = createContext<{user: User | null}>({ user: null })

export function AuthProvider({ user, children }: { user: User | null, children: React.ReactNode }) {
  return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext).user
}
