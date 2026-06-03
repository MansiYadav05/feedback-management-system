import { createContext, useState, useContext, ReactNode } from 'react'
import axios from 'axios'

interface Admin {
    id: string
    email: string
    name: string
}

interface AuthContextType {
    admin: Admin | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    loading: boolean
    error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<Admin | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const login = async (email: string, password: string) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.post('http://localhost:5000/admin/login', {
                email,
                password
            })

            const { admin: adminData, token } = response.data
            setAdmin(adminData)
            localStorage.setItem('authToken', token)
            localStorage.setItem('admin', JSON.stringify(adminData))
        } catch (err: any) {
            const message = err.response?.data?.message || 'Login failed'
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setAdmin(null)
        localStorage.removeItem('authToken')
        localStorage.removeItem('admin')
    }

    return (
        <AuthContext.Provider value={{
            admin,
            isAuthenticated: !!admin,
            login,
            logout,
            loading,
            error
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
