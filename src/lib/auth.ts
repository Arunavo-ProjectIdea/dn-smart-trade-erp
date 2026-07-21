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

// Mock Auth Service mimicking a token-based layout
export const AuthService = {
  login: async (email: string, roleHint?: UserRole): Promise<User> => {
    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // In a real application, the backend checks credentials and returns the user object with its role.
    // For our mock, we just return the role they clicked or requested.
    const role = roleHint || "Admin"
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_user_role', role)
    }
    return mockUsers[role]
  },
  
  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_user_role')
    }
  },
  
  getCurrentUser: (): User | null => {
    // Real implementation would decode JWT or hit /me endpoint
    // We will read from localStorage if on client, otherwise default to Admin for SSR
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('mock_user_role') as UserRole
      if (savedRole && mockUsers[savedRole]) {
        return mockUsers[savedRole]
      }
      return null
    }
    // For SSR, assume null (logged out) to allow client to redirect
    return null
  }
}
