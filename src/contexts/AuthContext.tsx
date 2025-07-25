
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export type MotherhoodStage = "ttc" | "pregnant" | "postpartum" | "toddler" | "none";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  motherhoodStage: MotherhoodStage;
  profileImage?: string;
  bio?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, stage: MotherhoodStage) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, { password: string, profile: UserProfile }> = {
  "user@example.com": {
    password: "password123",
    profile: {
      id: "1",
      name: "Sarah Johnson",
      email: "user@example.com",
      motherhoodStage: "postpartum",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      bio: "Mom of 2, fitness enthusiast, always looking for quick workouts!",
      createdAt: new Date(),
    }
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check if user is logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("catalyst_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt)
        });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("catalyst_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUser = MOCK_USERS[email];
      
      if (!mockUser || mockUser.password !== password) {
        throw new Error("Invalid credentials");
      }
      
      setUser(mockUser.profile);
      localStorage.setItem("catalyst_user", JSON.stringify(mockUser.profile));
      
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${mockUser.profile.name}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, stage: MotherhoodStage) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (MOCK_USERS[email]) {
        throw new Error("Email already in use");
      }
      
      const newUser: UserProfile = {
        id: Math.random().toString(36).substring(2, 15),
        name,
        email,
        motherhoodStage: stage,
        createdAt: new Date()
      };
      
      // In a real app, we'd store this in a database
      MOCK_USERS[email] = {
        password,
        profile: newUser
      };
      
      setUser(newUser);
      localStorage.setItem("catalyst_user", JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome to Catalyst Mom, ${name}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("catalyst_user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        throw new Error("Not authenticated");
      }
      
      const updatedUser = { ...user, ...data };
      
      if (user.email !== data.email && data.email && MOCK_USERS[data.email]) {
        throw new Error("Email already in use");
      }
      
      if (data.email && user.email !== data.email) {
        // If email changed, update the mock users record
        const currentUserData = MOCK_USERS[user.email];
        delete MOCK_USERS[user.email];
        MOCK_USERS[data.email] = {
          ...currentUserData,
          profile: updatedUser
        };
      } else if (user.email) {
        // Update the existing record
        MOCK_USERS[user.email].profile = updatedUser;
      }
      
      setUser(updatedUser);
      localStorage.setItem("catalyst_user", JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: error instanceof Error ? error.message : "An error occurred"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
