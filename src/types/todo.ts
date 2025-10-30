export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    color?: string;
    pinned?: boolean;
  }
  
  export interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onEdit: (id: string, text: string) => void;
    onDelete: (id: string) => void;
    onColorChange: (id: string, color?: string) => void;
    onDragStart: (id: string) => void;
    onDragOver: (id: string) => void;
    onDragEnd: () => void;
    onTogglePin: (id: string) => void; 
    isDragging: boolean;
  }