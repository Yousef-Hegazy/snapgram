import { IAuthContextType, IUser } from "@/types";
import { useGetCurrentUser, useLogout } from "@/lib/react-query/queriesAndMutations";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useEffectEvent, useState } from "react";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuth: async () => false as boolean,
};

const AuthContext = createContext<IAuthContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const queryClient = useQueryClient();
  const { data: currentUser, error, isLoading } = useGetCurrentUser();
  const { mutate: logout } = useLogout();

  const handleStateEffect = useEffectEvent(() => {
    if (error) {
      setIsAuthenticated(false);
      setUser(INITIAL_USER);
      // Call logout
      logout();
      return;
    }
    if (currentUser) {
      setIsAuthenticated(true);
      setUser({
        id: currentUser.$id,
        name: currentUser.name,
        username: currentUser.username || "",
        email: currentUser.email,
        imageUrl: currentUser.imageUrl,
        bio: currentUser.bio || "",
      });
    }
  });

  useEffect(() => {
    handleStateEffect();
  }, [currentUser, error]);

  const checkAuth = async () => {
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
    const queryState = queryClient.getQueryState([QUERY_KEYS.GET_CURRENT_USER]);
    return !queryState?.error && !!queryState?.data;
  };

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;
