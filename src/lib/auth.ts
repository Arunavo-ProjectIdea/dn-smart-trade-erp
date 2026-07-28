export type UserRole = "Admin" | "Employee" | "Client"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

// Mock User Data
export const mockUsers: Record<UserRole, User> = {
  Admin: {
    id: "USR-001",
    name: "System Administrator",
    email: "admin@dnsmarttrade.com",
    role: "Admin",
  },
  Employee: {
    id: "USR-002",
    name: "Jane Doe",
    email: "employee@dnsmarttrade.com",
    role: "Employee",
  },
  Client: {
    id: "USR-003",
    name: "John Smith",
    email: "client@acmecorp.com",
    role: "Client",
  },
}

// Mock Auth Service for fallback or types only
export const AuthService = {
  login: async (email: string, roleHint?: UserRole): Promise<User> => {
    const role = roleHint || "Admin"
    return mockUsers[role]
  },
  
  logout: async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      await supabase.auth.signOut()
    }
  }
}
