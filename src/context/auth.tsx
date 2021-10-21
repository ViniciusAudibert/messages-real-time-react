import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from '../services/api'

interface User {
  id: string
  name: string
  login: string
  avatar_url: string
}

interface AuthContextData {
  user: User | null
  signInUrl: string
  signOut: () => void
}

const AuthContext = createContext({} as AuthContextData)

interface Props {
  children: ReactNode
}

interface AuthResponse {
  token: string
  user: User
}

const clientId = '12203f9f0fc73833df65'
const host = 'http://localhost:3000'

const SIGN_IN_URL = `https://github.com/login/oauth/authorize?scope=user&client_id=${clientId}&redirect_uri=${host}`
const STORAGE_KEY_TOKEN = '@dowhile:token'

const AuthProvider = (props: Props) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN)

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`

      api.get<User>('profile').then((response) => {
        setUser(response.data)
      })
    }
  }, [])

  useEffect(() => {
    const queryStringName = 'code'
    const url = new URL(location.href)
    const code = url.searchParams.get(queryStringName)

    if (code) {
      url.searchParams.delete(queryStringName)
      history.pushState({}, '', url.href)

      signIn(code)
    }
  }, [])

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', { code: githubCode })
    const { token, user } = response.data

    localStorage.setItem(STORAGE_KEY_TOKEN, token)
    api.defaults.headers.common.authorization = `Bearer ${token}`

    setUser(user)
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY_TOKEN)
  }

  return <AuthContext.Provider value={{ signInUrl: SIGN_IN_URL, signOut, user }}>{props.children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
