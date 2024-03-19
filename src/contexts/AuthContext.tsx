import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { ReactNode, createContext, useEffect, useState } from "react";
import * as userStorage from "@storage/user";
import * as authTokenStorage from "@storage/authToken";

type SignInDataProps = {
  email: string;
  password: string;
};

type UserAndTokenProps = {
  user: UserDTO;
  token: string;
};

export type AuthContextDataProps = {
  user: UserDTO;
  updateUserProfile: (updatedUser: UserDTO) => void;
  signIn: (data: SignInDataProps) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  function updateUserAndToken({ user, token }: UserAndTokenProps) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
  }

  async function storageUserAndToken({ user, token }: UserAndTokenProps) {
    try {
      setIsLoadingUserStorageData(true);

      await userStorage.set(user);
      await authTokenStorage.set(token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn({ email, password }: SignInDataProps) {
    try {
      const { data } = await api.post("/sessions", { email, password });
      if (data?.user && data?.token) {
        await storageUserAndToken({ user: data.user, token: data.token });
        updateUserAndToken({ user: data.user, token: data.token });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);

      delete api.defaults.headers.common["Authorization"];

      userStorage.remove();
      authTokenStorage.remove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function updateUserProfile(updatedUser: UserDTO) {
    try {
      setUser(updatedUser);
      await userStorage.set(updatedUser);
    } catch (error) {
      throw error;
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);

      const storageUser = await userStorage.get();
      const token = await authTokenStorage.get();
      if (storageUser && token) {
        updateUserAndToken({ user: storageUser, token });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUserProfile,
        signIn,
        signOut,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
