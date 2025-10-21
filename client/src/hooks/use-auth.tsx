import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
  appleLoginMutation: UseMutationResult<SelectUser, Error, AppleLoginData>;
};

type AppleLoginData = {
  id_token: string;
  user_info?: any;
};

type LoginData = {
  email: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      const data = await res.json();
      return data.user || data;
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Accesso effettuato",
        description: "Benvenuto in SeaBoo!",
      });
      // Reindirizza automaticamente alla homepage
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Errore di accesso",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      const data = await res.json();
      return data.user || data;
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registrazione completata",
        description: "Benvenuto in SeaBoo!",
      });
      // Reindirizza automaticamente alla homepage
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Errore di registrazione",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const appleLoginMutation = useMutation({
    mutationFn: async (appleData: AppleLoginData) => {
      console.log('📤 Sending Apple login request:', appleData);
      const res = await apiRequest("POST", "/auth/apple/callback", appleData);
      const data = await res.json();
      console.log('📥 Apple login response:', data);
      return data.user || data;
    },
    onSuccess: (user: SelectUser) => {
      console.log('✅ Apple login success:', user);
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Accesso con Apple effettuato",
        description: "Benvenuto in SeaBoo!",
      });
      // Reindirizza automaticamente alla homepage
      window.location.href = "/";
    },
    onError: (error: Error) => {
      console.error('❌ Apple login error:', error);
      toast({
        title: "Errore accesso Apple",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Disconnesso",
        description: "A presto!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Errore di disconnessione",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        appleLoginMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
