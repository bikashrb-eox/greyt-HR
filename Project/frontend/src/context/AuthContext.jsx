import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);



  // Fetch user profile and roles
  const fetchUserProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      setRoles([]);
      return;
    }

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError);
      } else {
        setProfile(profileData);
      }

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select(`
          role_id,
          roles:role_id (
            id,
            name
          )
        `)
        .eq("user_id", userId);

      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
      } else {
        const roleNames = rolesData?.map((ur) => ur.roles?.name).filter(Boolean) || [];
        setRoles(roleNames);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  useEffect(() => {
    // Get existing session on app load
    const initSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing session:", error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
          setRoles([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      console.log("AuthContext: Signing out...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("AuthContext: Error signing out:", error);
        throw error;
      }
      console.log("AuthContext: Signed out successfully");
      // Clear local state immediately in case listener doesn't fire
      setSession(null);
      setUser(null);
      setProfile(null);
      setRoles([]);
    } catch (error) {
      console.error("AuthContext: Unexpected error during sign out:", error);
      // Still clear local state on error
      setSession(null);
      setUser(null);
      setProfile(null);
      setRoles([]);
    }
  };

  // Helper function to check if user has a specific role
  const hasRole = (roleName) => {
    return roles.includes(roleName);
  };

  // Helper function to check if user has any of the specified roles
  const hasAnyRole = (roleNames) => {
    return roleNames.some((role) => roles.includes(role));
  };

  const value = {
    user,
    session,
    profile,
    roles,
    loading,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
