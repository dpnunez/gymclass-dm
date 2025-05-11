import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";
import { useRouter } from "expo-router";

type UserRole = "consumer" | "admin" | "manager";

// Create an interface for user profile data
interface UserProfile {
  userId: string;
  mail: string;
  displayName: string;
  birthDate: string;
  phone: string;
  role: UserRole;
  status: string;
  profilePicture: string;
  registration: string;
}

interface UserContextProps {
  user: User | null;
  userProfile: UserProfile | null; // Add userProfile to context
  loading: boolean;
  logout: () => Promise<void>;
  role: UserRole | null;
  redirectToHome: (userRole: UserRole) => void;
  getUserRole: (userId: string) => Promise<UserRole | null>;
  getUserProfile: (userId: string) => Promise<UserProfile | null>; // Add function to get user profile
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // Add userProfile state
  const [loading, setLoading] = useState(true);
  const userColletionRef = collection(firebaseDb, "userRole");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.emailVerified) {
        // Fetch user profile and role when authenticated
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          setUserProfile(profile);
          setUserRole(profile.role);
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
        setUserRole(null);
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Convert Firestore document to UserProfile
  const convertToUserProfile = (doc: DocumentData): UserProfile => {
    const data = doc.data();
    return {
      userId: data.userId,
      mail: data.mail,
      displayName: data.displayName,
      birthDate: data.birthDate,
      phone: data.phone,
      role: data.role as UserRole,
      status: data.status,
      profilePicture: data.profilePicture,
      registration: data.registration,
    };
  };

  // Get user profile from Firestore
  const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const q = query(userColletionRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const profile = convertToUserProfile(userDoc);

    return profile;
  };

  const getUserRole = async (userId: string) => {
    const profile = await getUserProfile(userId);
    if (!profile) {
      setUserRole(null);
      return null;
    }

    setUserRole(profile.role);
    return profile.role;
  };

  const logout = async () => {
    const auth = getAuth();
    await auth.signOut();
    setUser(null);
    setUserRole(null);
    setUserProfile(null);
    router.replace("/(not-auth)/login");
  };

  const redirectToHome = (userRole: UserRole) => {
    if (userRole === "consumer") {
      router.replace("/(auth)/user");
    } else if (userRole === "admin") {
      router.replace("/(auth)/admin");
    } else if (userRole === "manager") {
      router.replace("/(auth)/manager");
    } else {
      router.replace("/+not-found");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userProfile, // Add userProfile to context values
        loading,
        logout,
        role: userRole,
        getUserRole,
        getUserProfile, // Expose getUserProfile function
        redirectToHome
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};