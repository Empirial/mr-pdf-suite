import { useState, useEffect } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Handle session expiry/token refresh errors
        if (event === "TOKEN_REFRESHED" && !session) {
          handleSessionExpired();
          return;
        }

        if (event === "SIGNED_OUT") {
          setAuthState({
            user: null,
            session: null,
            loading: false,
          });
          return;
        }

        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
        });
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        handleAuthError(error);
        return;
      }
      
      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSessionExpired = () => {
    // Clear any stale auth data
    clearAuthData();
    
    setAuthState({
      user: null,
      session: null,
      loading: false,
    });

    toast({
      title: "Session expired",
      description: "Please log in again to continue.",
      variant: "destructive",
    });
  };

  const handleAuthError = (error: AuthError) => {
    console.error("Auth error:", error.message);
    
    // Handle specific auth errors
    if (
      error.message.includes("Refresh Token Not Found") ||
      error.message.includes("Invalid Refresh Token") ||
      error.code === "refresh_token_not_found"
    ) {
      handleSessionExpired();
      return;
    }

    setAuthState({
      user: null,
      session: null,
      loading: false,
    });
  };

  const clearAuthData = () => {
    // Clear Supabase auth tokens from localStorage
    const keysToRemove = Object.keys(localStorage).filter(
      (key) => key.startsWith("sb-") && key.includes("-auth-token")
    );
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      clearAuthData();
    } catch (error) {
      // Even if signOut fails, clear local state
      clearAuthData();
      setAuthState({
        user: null,
        session: null,
        loading: false,
      });
    }
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    signOut,
  };
};
