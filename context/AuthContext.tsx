import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";
import { useRouter } from "expo-router";

type UserRole = "consumer" | "admin" | "manager";
interface UserContextProps {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  role: UserRole | null;
  redirectToHome: (userRole: UserRole) => void;
  getUserRole: (userId: string) => Promise<UserRole>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const userColletionRef = collection(firebaseDb, "userRole");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser?.emailVerified) return;
      await getUserRole(
        firebaseUser.uid
      )

      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const getUserRole = async (userId: string) => {
    const queryUserRole = query(userColletionRef, where("userId", "==", userId));
    const userRoleRes = await getDocs(queryUserRole);
    const userRole = userRoleRes.docs[0].data().role;
    setUserRole(userRole as UserRole);


    return userRole;
  }

  const logout = async () => {
    const auth = getAuth();
    await auth.signOut();
    setUser(null);
    setUserRole(null);
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
  }

  return (
    <UserContext.Provider
      value={{ user, loading, logout, role: userRole, getUserRole, redirectToHome }}
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
