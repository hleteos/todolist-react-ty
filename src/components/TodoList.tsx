import { useState } from 'react';
import useTodos from '../hooks/useTodos';
import TodoItem from './TodoItem';
import { useTheme } from '../context/ThemeContext';

export default function TodoList() {
  const [newTodoText, setNewTodoText] = useState('');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const { darkMode, toggleDarkMode } = useTheme(); // importacion del hook 
  const {
    todos,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    assignRandomColor,
    setTodoColor,
    clearAllTodos,
    toggleAllTodos,
    togglePin,
    setTodos
  } = useTodos(); // hook de acciones de todo el Todolist. Diferentes funciones. CRUD

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText);
      setNewTodoText('');
    }
  };

  const handleColorChange = (id: string, color?: string) => {
    if (color) {
      setTodoColor(id, color);
    } else {
      assignRandomColor(id);
    }
  };

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDragOver = (id: string) => {
    if (!draggingId || draggingId === id) return;

    const draggedIndex = todos.findIndex(t => t.id === draggingId);
    const targetIndex = todos.findIndex(t => t.id === id);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newTodos = [...todos];
      const [removed] = newTodos.splice(draggedIndex, 1);
      newTodos.splice(targetIndex, 0, removed);
      setTodos(newTodos);
    }
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  return (
    <div className={`max-w-md mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-jakarta font-bold text-center ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>Lista del Día</h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"title={darkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={todos.length > 0 && todos.every(t => t.completed)}
            onChange={(e) => toggleAllTodos(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer mr-2"
            id="selectAll"
          />
          <label htmlFor="selectAll" className={`cursor-pointer select-none ${
            darkMode ? 'text-gray-300' : 'text-gray-800'
          }`}>
            {todos.every(t => t.completed) ? 'Deseleccionar todos' : 'Seleccionar todos'}
          </label>
        </div>

        <button
          onClick={clearAllTodos}
          disabled={todos.length === 0}
          className={`px-4 py-2 rounded-lg transition-colors ${
            todos.length === 0 // bloqueamos el botón si son igual a 0 las tareas añadidas
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
          }`}
        >
          🗑️ Eliminar todos
        </button>
      </div>

      <div className="flex mb-6">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)} // Se actualiza el valor del input
          onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          placeholder="Prueba técnica en de Wise Dreams..."
          className={`flex-grow px-4 py-2 border rounded-l-lg focus:outline-none  ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
          }`}
        />
        <button
          onClick={handleAddTodo}
          className={`px-4 py-2 text-white rounded-r-lg ${
            darkMode ? 'bg-[#569437] hover:bg-[#4a8230]' : 'bg-[#569437] hover:bg-[#6b9c4d]'
          } focus:outline-none cursor-pointer transition-colors`}
        >
        Añadir
        </button>
      </div>

      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className={`text-center font-jakarta py-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>¡No te olvides! Añade tu primera tarea.</p>
        ) : (
          // Mapeo de todos
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onEdit={editTodo}
              onDelete={deleteTodo}
              onColorChange={handleColorChange}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              isDragging={draggingId === todo.id}
              onTogglePin={togglePin}
            />
          ))
        )}
      </div>

      {todos.length > 0 && (
        <div className={`mt-4 text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {/* Filtra las tareas completadas utilizando .filter y cuenta cuántas son completadas sobre el total recorrido */}
          {todos.filter(t => t.completed).length} de {todos.length} tareas completadas
        </div>
        
      )}
    </div>
  );
}