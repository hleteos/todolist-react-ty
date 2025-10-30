import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';

/**
 * Custom hook que maneja la lógica de las tareas
 * Incluye persistencia en localStorage y opción de colores
 */
export default function useTodos() {
  // Estado inicial: carga desde localStorage o array vacío
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // Efecto: auto-guarda en localStorage cuando cambian los todos
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Añade nueva tarea
  const addTodo = (text: string) => {
    setTodos([...todos, {
      id: Date.now().toString(),
      text,
      completed: false
    }]);
  };

  // Cambia estado completado/no completado
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Edita el texto de una tarea
  const editTodo = (id: string, newText: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  // Elimina una tarea
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  // Elimina todas las tareas
  const clearAllTodos = () => {
    if (confirm('¿Estás seguro de eliminar todas las tareas?')) {
      setTodos([]);
    }
  };

  const togglePin = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, pinned: !todo.pinned } : todo
    ));
  };
  
  const toggleAllTodos = (completed: boolean) => {
  setTodos(todos.map(todo => ({ ...todo, completed })));
  };


  /**  
   * Asigna color aleatorio usando xColors-API (opcional) 
   */ 
  const assignRandomColor = async (id: string) => {
    // Se intenta solicitud a la API de colores xColors - color aleatorio para la tarea.
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Timeout de 3 segundos
      
      const response = await fetch('https://x-colors.yurace.pro/api/random/', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      const apiColor = data.hex || `#${data.hex}`;
      setTodos(currentTodos => {
        const todoExists = currentTodos.some(t => t.id === id);
        if (!todoExists) return currentTodos;
        
        return currentTodos.map(todo => 
          todo.id === id ? { ...todo, color: apiColor } : todo
        );
      });
      
    } catch (error) {
      // console.log("API no disponible, uso sin asignación de color. Asignando color local.");
      // Se asigna un color tomado de un array predefinido. Mantenemos un UI estable sin fallas debido a la API externa. 
      // Colores locales:
      const localColors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF' ];
      setTodos(todos.map(todo => 
        todo.id === id ? { 
          ...todo, 
          color: localColors[Math.floor(Math.random() * localColors.length)]
        } : todo
      ));
    }

  };

  // selección manual de color
  const setTodoColor = (id: string, color: string) => {
    setTodos(currentTodos => 
      currentTodos.map(todo => 
        todo.id === id ? { ...todo, color } : todo
      )
    );
  };

  return {
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
  };
}