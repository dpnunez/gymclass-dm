import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./AuthContext";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    doc,
    updateDoc,
    increment,
    onSnapshot,
    addDoc,
    deleteDoc,
    getDoc,
    writeBatch
} from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";
import { GestorClassProps } from "@/types/ManagerTypes";

// Maximum number of classes a user can enroll
const MAX_CLASS_ENROLLMENTS = 5;

interface ClassContextProps {
    // Class data
    classes: GestorClassProps[];
    loading: boolean;

    // User enrollments
    userEnrollments: string[];
    maxClassesReached: boolean;

    // Date selection
    currentDate: Date;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;

    // Actions
    enrollInClass: (classId: string) => Promise<boolean>;
    cancelEnrollment: (classId: string) => Promise<boolean>;
    createClass: (classData: Omit<GestorClassProps, "id" | "inscritos">) => Promise<string | null>;
    updateClass: (classId: string, classData: Partial<Omit<GestorClassProps, "id">>) => Promise<boolean>;
    deleteClass: (classId: string) => Promise<boolean>;

    // Filtered data
    getClassesForCurrentDate: () => GestorClassProps[];
    isUserEnrolled: (classId: string) => boolean;
    getClassById: (classId: string) => GestorClassProps | undefined;
}

const ClassContext = createContext<ClassContextProps | undefined>(undefined);

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // State
    const [classes, setClasses] = useState<GestorClassProps[]>([]);
    const [userEnrollments, setUserEnrollments] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(todayMidnight);

    // Computed properties
    const maxClassesReached = userEnrollments.length >= MAX_CLASS_ENROLLMENTS;

    // Fetch class data
    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            try {
                const classesRef = collection(firebaseDb, "classes");
                const currentTime = Timestamp.fromDate(new Date());

                // Query classes that haven't started yet
                const classesQuery = query(
                    classesRef,
                    where("startingDate", ">=", currentTime),
                    orderBy("startingDate", "asc")
                );

                // Use onSnapshot for real-time updates
                const unsubscribe = onSnapshot(classesQuery, (snapshot) => {
                    const classesData = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            name: data.name,
                            description: data.description,
                            prof: data.prof,
                            startingDate: data.startingDate.toDate(),
                            minuteLength: data.minuteLength,
                            vagas: data.vagas,
                            inscritos: data.inscritos,
                            sala: data.sala
                        } as GestorClassProps;
                    });

                    setClasses(classesData);
                    setLoading(false);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching classes:", error);
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    // Fetch user enrollment data
    useEffect(() => {
        if (!user) {
            setUserEnrollments([]);
            return;
        }

        const fetchUserEnrollments = async () => {
            try {
                const enrollmentsRef = collection(firebaseDb, "enrollments");
                const userEnrollmentsQuery = query(enrollmentsRef, where("userId", "==", user.uid));

                // Use onSnapshot for real-time updates
                const unsubscribe = onSnapshot(userEnrollmentsQuery, (snapshot) => {
                    const enrollments = snapshot.docs.map(doc => doc.data().classId);
                    setUserEnrollments(enrollments);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching user enrollments:", error);
            }
        };

        fetchUserEnrollments();
    }, [user]);

    // Get filtered classes for the selected date
    const getClassesForCurrentDate = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);

        return classes.filter(
            aula => aula.startingDate >= currentDate && aula.startingDate < nextDate
        );
    };

    // Check if user is enrolled in a class
    const isUserEnrolled = (classId: string) => {
        return userEnrollments.includes(classId);
    };

    // Get class by ID
    const getClassById = (classId: string) => {
        return classes.find(c => c.id === classId);
    };

    // Enroll user in a class
    const enrollInClass = async (classId: string): Promise<boolean> => {
        if (!user) return false;

        if (maxClassesReached) {
            alert("Você atingiu o limite máximo de aulas!");
            return false;
        }

        try {
            // Check if already enrolled
            if (isUserEnrolled(classId)) {
                return true;
            }

            // Check if class is full
            const classData = getClassById(classId);
            if (!classData || classData.inscritos >= classData.vagas) {
                alert("Esta aula está lotada.");
                return false;
            }

            // Add enrollment document
            const enrollmentsRef = collection(firebaseDb, "enrollments");
            await addDoc(enrollmentsRef, {
                userId: user.uid,
                classId: classId,
                enrolledAt: Timestamp.now()
            });

            // Update class numbers
            const classRef = doc(firebaseDb, "classes", classId);
            await updateDoc(classRef, {
                inscritos: increment(1)
            });

            return true;
        } catch (error) {
            console.error("Error enrolling in class:", error);
            alert("Erro ao inscrever-se na aula. Tente novamente.");
            return false;
        }
    };

    // Cancel enrollment in a class
    const cancelEnrollment = async (classId: string): Promise<boolean> => {
        if (!user) return false;

        try {
            // Find the enrollment document
            const enrollmentsRef = collection(firebaseDb, "enrollments");
            const q = query(
                enrollmentsRef,
                where("userId", "==", user.uid),
                where("classId", "==", classId)
            );

            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                return false;
            }

            // Delete the enrollment document
            await deleteDoc(querySnapshot.docs[0].ref);

            // Update class numbers
            const classRef = doc(firebaseDb, "classes", classId);
            await updateDoc(classRef, {
                inscritos: increment(-1)
            });

            return true;
        } catch (error) {
            console.error("Error canceling enrollment:", error);
            alert("Erro ao cancelar inscrição. Tente novamente.");
            return false;
        }
    };

    // Create a new class
    const createClass = async (classData: Omit<GestorClassProps, "id" | "inscritos">): Promise<string | null> => {
        if (!user) return null;

        try {
            // Add the class document
            const classesRef = collection(firebaseDb, "classes");
            const newClassData = {
                ...classData,
                inscritos: 0,
                status: "upcoming",
                startingDate: Timestamp.fromDate(classData.startingDate)
            };

            const docRef = await addDoc(classesRef, newClassData);
            return docRef.id;
        } catch (error) {
            console.error("Error creating class:", error);
            alert("Erro ao criar aula. Tente novamente.");
            return null;
        }
    };

    // Update an existing class
    const updateClass = async (classId: string, classData: Partial<Omit<GestorClassProps, "id">>): Promise<boolean> => {
        if (!user) return false;

        try {
            const classRef = doc(firebaseDb, "classes", classId);

            // Convert date to Timestamp if present
            const updateData = { ...classData };
            if (updateData.startingDate) {
                updateData.startingDate = updateData.startingDate as Date;
            }

            await updateDoc(classRef, updateData);
            return true;
        } catch (error) {
            console.error("Error updating class:", error);
            alert("Erro ao atualizar aula. Tente novamente.");
            return false;
        }
    };

    // Delete a class
    const deleteClass = async (classId: string): Promise<boolean> => {
        if (!user) return false;

        try {
            // Delete the class
            const classRef = doc(firebaseDb, "classes", classId);
            await deleteDoc(classRef);

            // Delete associated enrollments
            const enrollmentsRef = collection(firebaseDb, "enrollments");
            const q = query(enrollmentsRef, where("classId", "==", classId));
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(firebaseDb);
            querySnapshot.forEach((docSnapshot) => {
                deleteDoc(docSnapshot.ref)
                batch.delete(docSnapshot.ref);
            });

            await batch.commit();
            return true;
        } catch (error) {
            console.error("Error deleting class:", error);
            alert("Erro ao excluir aula. Tente novamente.");
            return false;
        }
    };

    return (
        <ClassContext.Provider
            value={{
                classes,
                loading,
                userEnrollments,
                maxClassesReached,
                currentDate,
                setCurrentDate,
                enrollInClass,
                cancelEnrollment,
                createClass,
                updateClass,
                deleteClass,
                getClassesForCurrentDate,
                isUserEnrolled,
                getClassById
            }}
        >
            {children}
        </ClassContext.Provider>
    );
};

export const useClasses = (): ClassContextProps => {
    const context = useContext(ClassContext);
    if (!context) {
        throw new Error("useClasses must be used within a ClassProvider");
    }
    return context;
};