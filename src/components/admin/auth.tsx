import * as React from 'react'

export interface AuthContext {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  user: string | null
}

const AuthContext = React.createContext<AuthContext | null>(null)

const key = 'tanstack.auth.user'

function getStoredUser() {
  return localStorage.getItem(key)
}

function setStoredUser(user: string | null) {
  if (user) {
    localStorage.setItem(key, user)
  } else {
    localStorage.removeItem(key)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<string | null>(getStoredUser())
  const isAuthenticated = !!user

  const logout = React.useCallback(async () => {

    setStoredUser(null)
    setUser(null)
  }, [])

  const login = React.useCallback(async (username: string, password: string) => {
    const url = "https://login-74wo5hr7ua-uc.a.run.app"
    const response = await fetch(`${url}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
      method: 'GET',
    })
    const data = await response.json()
    if (data.token) {
      setStoredUser(username)
      setUser(username)
    } else {
      throw new Error('Invalid username or password')
    }
  }, [])

  React.useEffect(() => {
    setUser(getStoredUser())
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}