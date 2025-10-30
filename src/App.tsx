import "./App.css";
import TodoList from './components/TodoList';
import { ThemeProvider, useTheme } from './context/ThemeContext'; // ThemeContext para manejar el theme. En proceso para readaptar modo oscuro y css


const AppWrapper = () => {
  const { darkMode } = useTheme();
  // useTheme() para obtener el estado del tema (oscuro o claro)

  return (
    <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
      <div className="overflow-y-auto h-full w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className={`text-center text-3xl font-bold py-4 
            ${ darkMode ? 'text-white' : 'text-black' }`}> 
            {/* En uso la clase dinámica que cambia el color del texto dependiendo del tema */}
            The Wise Dreams
          </h1>
          <TodoList />
        </div>
      </div>
    </div>
  );
};

// Componente 
const App = () => {
  return (
    <ThemeProvider>
      <AppWrapper />
    </ThemeProvider>
  );
};

export default App;