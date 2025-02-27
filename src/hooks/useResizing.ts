import { useRef, useCallback } from 'react';

const useResizing = () => {
  const resizeRef = useRef({
    isResizing: false,
    initialX: 0,
    initialY: 0,
    initialWidth: 0,
    initialHeight: 0,
    currentColumn: null,
    currentRow: null,
  });

  const handleColumnResizeStart = useCallback((e, column) => {
    e.preventDefault();
    e.stopPropagation();

    const resizeState = resizeRef.current;
    resizeState.isResizing = true;
    resizeState.initialX = e.clientX;
    resizeState.currentColumn = column;
    resizeState.initialWidth = columnWidths[column];

    const handleMouseMove = (e) => {
      if (!resizeState.isResizing || !resizeState.currentColumn) return;

      const diff = e.clientX - resizeState.initialX;
      const newWidth = Math.max(50, resizeState.initialWidth + diff);

      setColumnWidths((prev) => ({
        ...prev,
        [resizeState.currentColumn]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      resizeState.isResizing = false;
      resizeState.currentColumn = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [columnWidths]);

  const handleRowResizeStart = useCallback((e, row) => {
    e.preventDefault();
    e.stopPropagation();

    const resizeState = resizeRef.current;
    resizeState.isResizing = true;
    resizeState.initialY = e.clientY;
    resizeState.currentRow = row;
    resizeState.initialHeight = rowHeights[row];

    const handleMouseMove = (e) => {
      if (!resizeState.isResizing || !resizeState.currentRow) return;

      const diff = e.clientY - resizeState.initialY;
      const newHeight = Math.max(24, resizeState.initialHeight + diff);

      setRowHeights((prev) => ({
        ...prev,
        [resizeState.currentRow]: newHeight,
      }));
    };

    const handleMouseUp = () => {
      resizeState.isResizing = false;
      resizeState.currentRow = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [rowHeights]);

  return {
    handleColumnResizeStart,
    handleRowResizeStart,
  };
};

export default useResizing;