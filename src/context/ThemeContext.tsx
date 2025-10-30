import { createContext, useContext, useState, useEffect } from 'react';

// El tipo contiene dos propiedades: darkMode (booleano) y toggleDarkMode ()
type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};
const ThemeContext = createContext<ThemeContextType>({
  darkMode: false, // empieza definida en false.
  toggleDarkMode: () => {},
});

// Usamos useState para crear el estado darkMode, con valor inicial basado en localStorage.
  // Si hay un valor guardado en localStorage, se usa; si no, se asume que el modo claro está activado.

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    // Persistencia en localStorage del darkmode. 
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.className = darkMode ? 'dark' : '';
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
    // Limpieza de estilos del body
    
    const appElement = document.querySelector('.min-h-screen');
    if (appElement) {
      appElement.classList.add('transition-colors', 'duration-300');
    }
  }, [darkMode]); // Si true se añade transición de color en pantalla. 

  // Cambios del estado toggle darkMode. True - False. 
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
  // Custom hook para acceder al contexto ThemeContext desde cualquier componente hijo
export const useTheme = () => useContext(ThemeContext);