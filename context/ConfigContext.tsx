import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./AuthContext";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    Timestamp
} from "firebase/firestore";
import { firebaseDb } from "@/firebase.config";
import { Alert } from "react-native";

// Configuration data type
export interface AppConfigProps {
    name: string;
    phone: string;
    email: string;
    address: string;
    color: string;
    logo: string;
    updatedAt?: Timestamp;
}

// Default configuration as fallback
const defaultConfig: AppConfigProps = {
    name: "Ginásio Teste",
    phone: "+351920421443",
    email: "example@mail.com",
    address: "Av Sá Carneiro 320, Bragança, Bragança, Portugal",
    color: "#007AFF",
    logo: "https://i.imgur.com/3FtD3k5.png",
};

interface ConfigContextProps {
    // Configuration data
    config: AppConfigProps;
    loading: boolean;

    // Update functions
    updateConfig: (configData: Partial<AppConfigProps>) => Promise<boolean>;
    validateConfigData: (configData: Partial<AppConfigProps>) => { isValid: boolean; message?: string };
}

const ConfigContext = createContext<ConfigContextProps | undefined>(undefined);

export const CONFIG_DOC_ID = "app_config"; // Fixed document ID for the configuration

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [config, setConfig] = useState<AppConfigProps>(defaultConfig);
    const [loading, setLoading] = useState(true);

    // Fetch configuration data
    useEffect(() => {
        const fetchConfig = async () => {
            setLoading(true);
            try {
                const configRef = doc(firebaseDb, "configurations", CONFIG_DOC_ID);
                const configSnapshot = await getDoc(configRef);

                if (configSnapshot.exists()) {
                    // Configuration exists, use it
                    const configData = configSnapshot.data() as AppConfigProps;
                    setConfig(configData);
                } else {
                    // No configuration found, initialize with default values
                    const newConfig = {
                        ...defaultConfig,
                        updatedAt: Timestamp.now()
                    };
                    await setDoc(configRef, newConfig);
                    setConfig(newConfig);
                }
            } catch (error) {
                console.error("Error fetching app configuration:", error);
                // Fallback to default configuration on error
                setConfig(defaultConfig);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    // Validate configuration data before saving
    const validateConfigData = (configData: Partial<AppConfigProps>) => {
        // Validate name if provided
        if (configData.name !== undefined && configData.name.trim().length < 2) {
            return {
                isValid: false,
                message: "Nome inválido. Insira um nome com mais de 2 caracteres."
            };
        }

        // Validate phone if provided
        if (configData.phone !== undefined) {
            const phoneRegex = /^\+?\d{8,}$/;
            if (!phoneRegex.test(configData.phone.trim())) {
                return {
                    isValid: false,
                    message: "Telemóvel inválido. Insira um número de telemóvel válido."
                };
            }
        }

        // Validate email if provided
        if (configData.email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(configData.email.trim())) {
                return {
                    isValid: false,
                    message: "Email inválido. Insira um email válido."
                };
            }
        }

        // Validate address if provided
        if (configData.address !== undefined && configData.address.trim().length < 10) {
            return {
                isValid: false,
                message: "Morada inválida. Insira uma morada válida."
            };
        }

        // Validate logo URL if provided
        if (configData.logo !== undefined) {
            const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            if (!urlRegex.test(configData.logo.trim())) {
                return {
                    isValid: false,
                    message: "URL do logotipo inválido. Insira um URL válido."
                };
            }
        }

        return { isValid: true };
    };

    // Update configuration
    const updateConfig = async (configData: Partial<AppConfigProps>): Promise<boolean> => {
        if (!user) {
            Alert.alert("Erro", "Você precisa estar autenticado para atualizar as configurações.");
            return false;
        }

        // Validate data before saving
        const validation = validateConfigData(configData);
        if (!validation.isValid) {
            Alert.alert("Dados Inválidos", validation.message);
            return false;
        }

        try {
            const configRef = doc(firebaseDb, "configurations", CONFIG_DOC_ID);

            // Add timestamp to the update
            const updateData = {
                ...configData,
                updatedAt: Timestamp.now()
            };

            await updateDoc(configRef, updateData);

            // Update local state
            setConfig(currentConfig => ({
                ...currentConfig,
                ...configData,
                updatedAt: Timestamp.now()
            }));

            return true;
        } catch (error) {
            console.error("Error updating configuration:", error);
            Alert.alert("Erro", "Erro ao atualizar configurações. Tente novamente.");
            return false;
        }
    };

    return (
        <ConfigContext.Provider
            value={{
                config,
                loading,
                updateConfig,
                validateConfigData
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = (): ConfigContextProps => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
};;