import { useGetCurrentUser, useLogout } from '@/lib/react-query'
import { QUERY_KEYS } from '@/lib/react-query/queryKeys'
import type { IAuthContextType, IUser } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from 'react'

export const INITIAL_USER: IUser = {
  id: '',
  name: '',
  username: '',
  email: '',
  imageUrl: '',
  bio: '',
  // followers: [],
  // followees: [],
  followersCount: 0,
  followeesCount: 0,
  postCount: 0,
}

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuth: async () => false as boolean,
}

const AuthContext = createContext<IAuthContextType>(INITIAL_STATE)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const queryClient = useQueryClient()
  const {
    data: currentUser,
    error,
    isPending: isLoading,
    refetch: refetchCurrentUser,
  } = useGetCurrentUser()
  const { mutate: logout } = useLogout()

  const handleStateEffect = useEffectEvent(() => {
    if (error) {
      setIsAuthenticated(false)
      setUser(INITIAL_USER)
      logout()
    } else if (currentUser) {
      setIsAuthenticated(true)
      setUser({
        id: currentUser.$id,
        name: currentUser.name,
        username: currentUser.username || '',
        email: currentUser.email,
        imageUrl: currentUser.imageUrl,
        bio: currentUser.bio || '',
        postCount: currentUser.postCount || 0,
        followersCount: currentUser.followersCount || 0,
        followeesCount: currentUser.followeesCount || 0,
      })
    }
  })

  useEffect(() => {
    handleStateEffect()
  }, [currentUser, error])

  const getCachedUser = () =>
    queryClient.getQueryData([QUERY_KEYS.GET_CURRENT_USER])

  const checkAuth = async () => {
    const cached = getCachedUser()

    if (cached) return true

    await refetchCurrentUser()

    const isLoggedIn = getCachedUser()

    return !!isLoggedIn
  }

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export default AuthProvider
