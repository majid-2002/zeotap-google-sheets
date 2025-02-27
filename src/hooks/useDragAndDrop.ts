import { useState, useRef, useCallback } from 'react';

const useDragAndDrop = (onDrop: (source: string, target: string) => void) => {
  const [draggedCell, setDraggedCell] = useState<string | null>(null);
  const dragRef = useRef<HTMLTableCellElement | null>(null);

  const handleDragStart = useCallback((cellId: string) => {
    setDraggedCell(cellId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((targetCellId: string) => {
    if (draggedCell) {
      onDrop(draggedCell, targetCellId);
      setDraggedCell(null);
    }
  }, [draggedCell, onDrop]);

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    draggedCell,
  };
};

export default useDragAndDrop;