import type React from "react";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

interface ThemeContextType {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
	setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

interface ThemeProviderProps {
	children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	// Get initial theme from localStorage or system preference
	const getInitialTheme = (): boolean => {
		// Check if user has previously set a preference
		const savedTheme = localStorage.getItem("darkMode");
		if (savedTheme !== null) {
			return savedTheme === "true";
		}

		// If no saved preference, check system preference
		if (window.matchMedia?.("(prefers-color-scheme: dark)")?.matches) {
			return true;
		}

		// Default to light mode
		return false;
	};

	const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);

	// Apply theme to document element and save to localStorage
	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}

		// Save preference to localStorage
		localStorage.setItem("darkMode", isDarkMode.toString());
	}, [isDarkMode]);

	// Listen for system theme changes
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (e: MediaQueryListEvent) => {
			// Only update if user hasn't explicitly set a preference
			if (localStorage.getItem("darkMode") === null) {
				setIsDarkMode(e.matches);
			}
		};

		// Add event listener
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener("change", handleChange);
		} else {
			// Fallback for older browsers
			mediaQuery.addListener(handleChange);
		}

		// Clean up
		return () => {
			if (mediaQuery.removeEventListener) {
				mediaQuery.removeEventListener("change", handleChange);
			} else {
				// Fallback for older browsers
				mediaQuery.removeListener(handleChange);
			}
		};
	}, []);

	const toggleDarkMode = () => {
		if (!document.startViewTransition) {
			setIsDarkMode(!isDarkMode);
			return;
		}

		// Disable all CSS transitions during the theme change
		const css = document.createElement("style");
		css.appendChild(
			document.createTextNode(
				`* {
					-webkit-transition: none !important;
					-moz-transition: none !important;
					-o-transition: none !important;
					-ms-transition: none !important;
					transition: none !important;
				}`,
			),
		);
		document.head.appendChild(css);

		const transition = document.startViewTransition(() => {
			flushSync(() => {
				setIsDarkMode(!isDarkMode);
			});
		});

		transition.finished.then(() => {
			document.head.removeChild(css);
		});
	};

	const setDarkMode = (isDark: boolean) => {
		if (!document.startViewTransition) {
			setIsDarkMode(isDark);
			return;
		}

		const css = document.createElement("style");
		css.appendChild(
			document.createTextNode(
				`* {
					-webkit-transition: none !important;
					-moz-transition: none !important;
					-o-transition: none !important;
					-ms-transition: none !important;
					transition: none !important;
				}`,
			),
		);
		document.head.appendChild(css);

		const transition = document.startViewTransition(() => {
			flushSync(() => {
				setIsDarkMode(isDark);
			});
		});

		transition.finished.then(() => {
			document.head.removeChild(css);
		});
	};

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode }}>
			{children}
		</ThemeContext.Provider>
	);
};
export const ThemeConsumer = ThemeContext.Consumer;
