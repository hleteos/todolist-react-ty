import { useState, useRef, useEffect } from 'react';
import { TodoItemProps } from '../types/todo';
import { useTheme } from '../context/ThemeContext';

// Paleta de colores locales no con API
const COLOR_PALETTE = [
  'green', 'red', 'yellow', 'blue'
];

// Funciones
export default function TodoItem({ 
  todo, 
  onToggle, 
  onEdit, 
  onDelete,
  onColorChange,
  onDragStart,
  onDragOver,
  onDragEnd,
  onTogglePin,
  isDragging
}: TodoItemProps) {
  // Estados
  const { darkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [showPalette, setShowPalette] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  // Efecto para enfocar el campo de texto cuando se inicia la edición
  useEffect(() => {
    if (isEditing && itemRef.current) {
      const input = itemRef.current.querySelector('input[type="text"]') as HTMLInputElement;
      input?.focus();
    }
  }, [isEditing]);

  // Función para manejar la edición del texto
  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText);
      setIsEditing(false);
    }
  };

  // Función para manejar el cambio aleatorio de color
  const handleRandomColor = () => {
    setIsRotating(true);
    onColorChange(todo.id);
    setTimeout(() => setIsRotating(false), 1000);
  };

  // Función para manejar la selección de un color específico
  const handleSelectColor = (color: string) => {
    onColorChange(todo.id, color);
    setShowPalette(false);
  };

  return (
    <div
      ref={itemRef}
      draggable
      onDragStart={() => onDragStart(todo.id)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(todo.id);
      }}
      onDragEnd={onDragEnd}
      className={`flex items-center justify-between p-3 mb-2 rounded-lg shadow-sm transition-colors ${
        todo.completed 
          ? darkMode 
            ? 'bg-gray-700' 
            : 'bg-gray-100' 
          : darkMode 
            ? 'bg-gray-800' 
            : 'bg-white'
      } ${
        isDragging ? 'opacity-50 border-2 border-blue-500' : ''
      } ${
        todo.pinned ? 'ring-2 ring-yellow-400' : ''
      }`}
      style={todo.color ? { borderLeft: `4px solid ${todo.color}` } : {}}
    >
      <div className="flex items-center gap-3 flex-grow">
        <div
          className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          onMouseDown={() => onDragStart(todo.id)}
        >
          ⋮⋮
        </div>

        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
            }`}
          />
        ) : (
          <span
            className={`flex-grow ${
              todo.completed 
                ? 'line-through text-gray-400' 
                : darkMode 
                  ? 'text-white' 
                  : 'text-gray-800'
            }`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onTogglePin(todo.id)}
          className={`p-1 ${
            darkMode ? 'text-gray-300 hover:text-yellow-400 cursor-pointer' : 'text-gray-500 hover:text-yellow-500 cursor-pointer'
          } transition-colors`}
          title={todo.pinned ? 'Desfijar' : 'Fijar'}
        >
          {todo.pinned ? '📌' : '📍'}
        </button>

        <button
          onClick={handleRandomColor}
          className={`p-1 ${
            darkMode ? 'text-gray-300 hover:text-purple-400 cursor-pointer' : 'text-gray-500 hover:text-purple-600 cursor-pointer'
          } transition-all ${isRotating ? 'animate-spin' : ''}`}
          title="Color aleatorio"
          aria-label="Color aleatorio"
        >
          ?
        </button>

        <div className="relative">
          <button
            onClick={() => setShowPalette(!showPalette)}
            className={`p-1 ${
              darkMode ? 'text-gray-300 hover:text-blue-400 cursor-pointer' : 'text-gray-500 hover:text-blue-500 cursor-pointer'
            } transition-colors`}
            title="Seleccionar color"
            aria-label="Seleccionar color"
            aria-expanded={showPalette}
          >
            🎨
          </button>
          
          {showPalette && (
            <div className={`absolute right-0 z-10 mt-2 p-2 rounded-md shadow-lg border cursor-pointer ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <div className="flex flex-wrap gap-2 max-w-full">
                {COLOR_PALETTE.map(color => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-full border hover:border-gray-400 transition-colors cursor-pointer"
                    style={{ 
                      backgroundColor: color,
                      borderColor: darkMode ? '#4B5563' : '#E5E7EB'
                    }}
                    onClick={() => handleSelectColor(color)}
                    title={`Color ${color}`}
                    aria-label={`Seleccionar color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`p-1 ${
            darkMode ? 'text-gray-300 hover:text-blue-400 cursor-pointer' : 'text-gray-500 hover:text-blue-500 cursor-pointer'
          } transition-colors`}
          title="Editar"
        >
          ✏️
        </button>

        <button
          onClick={() => onDelete(todo.id)}
          className={`p-1 ${
            darkMode ? 'text-gray-300 hover:text-red-400 cursor-pointer' : 'text-gray-500 hover:text-red-500 cursor-pointer'
          } transition-colors`}
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}