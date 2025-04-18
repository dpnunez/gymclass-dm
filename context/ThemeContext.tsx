import React, { createContext, useState, useContext } from 'react';
import { DefaultTheme } from '@react-navigation/native';
import { Colors, updateColorsConstant } from '@/constants/Colors';

export type ThemeType = typeof DefaultTheme;

interface ThemeContextType {
    theme: ThemeType;
    updatePrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: DefaultTheme,
    updatePrimaryColor: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>({
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: Colors.light.tint,
        },
    });

    const updatePrimaryColor = (color: string) => {
        setTheme(prevTheme => ({
            ...prevTheme,
            colors: {
                ...prevTheme.colors,
                primary: color,
            },
        }));

        updateColorsConstant(color);
    };

    return (
        <ThemeContext.Provider value={{ theme, updatePrimaryColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
