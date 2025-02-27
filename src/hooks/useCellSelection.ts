import { useState, useEffect } from 'react';

const useCellSelection = (initialCell: string) => {
  const [selectedCells, setSelectedCells] = useState<string[]>([initialCell]);
  const [selectionStart, setSelectionStart] = useState<string | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<string | null>(null);

  const updateSelection = (start: string, end: string) => {
    const startCol = start.match(/[A-Z]+/)?.[0] || "";
    const startRow = parseInt(start.replace(/[A-Z]+/, "")) || 0;
    const endCol = end.match(/[A-Z]+/)?.[0] || "";
    const endRow = parseInt(end.replace(endCol, "")) || 0;

    const selected: string[] = [];
    const colRange = [Math.min(startCol.charCodeAt(0), endCol.charCodeAt(0)), Math.max(startCol.charCodeAt(0), endCol.charCodeAt(0))];
    const rowRange = [Math.min(startRow, endRow), Math.max(startRow, endRow)];

    for (let c = colRange[0]; c <= colRange[1]; c++) {
      for (let r = rowRange[0]; r <= rowRange[1]; r++) {
        selected.push(String.fromCharCode(c) + r);
      }
    }

    setSelectedCells(selected);
  };

  const handleMouseDown = (cellId: string) => {
    setSelectionStart(cellId);
    setSelectionEnd(cellId);
    setSelectedCells([cellId]);
  };

  const handleMouseUp = () => {
    if (selectionStart && selectionEnd) {
      updateSelection(selectionStart, selectionEnd);
    }
  };

  const handleMouseMove = (cellId: string) => {
    if (selectionStart) {
      setSelectionEnd(cellId);
      updateSelection(selectionStart, cellId);
    }
  };

  useEffect(() => {
    setSelectedCells([initialCell]);
  }, [initialCell]);

  return {
    selectedCells,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
  };
};

export default useCellSelection;