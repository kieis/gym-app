import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { ReactNode, createContext, useEffect, useState } from "react";
import * as userStorage from "@storage/user";

type SignInDataProps = {
  email: string;
  password: string;
};

export type AuthContextDataProps = {
  user: UserDTO;
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

  async function signIn({ email, password }: SignInDataProps) {
    try {
      const { data } = await api.post("/sessions", { email, password });
      if (data?.user) {
        setUser(data.user);
        userStorage.set(data.user);
      }
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);
      userStorage.remove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function loadUserData() {
    try {
      const storageUser = await userStorage.get();
      if (storageUser) {
        setUser(storageUser);
        setIsLoadingUserStorageData(false);
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
      value={{ user, signIn, signOut, isLoadingUserStorageData }}
    >
      {children}
    </AuthContext.Provider>
  );
}
