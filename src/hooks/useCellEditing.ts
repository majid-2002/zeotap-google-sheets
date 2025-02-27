import { useState, useRef, useEffect } from 'react';

const useCellEditing = (selectedCell, setCellData, formulaBarValue, setFormulaBarValue) => {
  const lastCaretPositionRef = useRef(0);
  const currentEditCellRef = useRef(null);
  const isTypingRef = useRef(false);

  const handleCellInput = (cellId, newContent) => {
    isTypingRef.current = true;
    currentEditCellRef.current = cellId;

    setCellData((prev) => ({
      ...prev,
      [cellId]: newContent,
    }));

    if (selectedCell === cellId) {
      setFormulaBarValue(newContent);
    }

    lastCaretPositionRef.current = getCaretPosition(cellId);
  };

  const getCaretPosition = (cellId) => {
    const cellElement = document.querySelector(`[data-cell-id="${cellId}"]`);
    let caretOffset = 0;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(cellElement);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
  };

  const restoreCaretPosition = (cellId) => {
    const cellElement = document.querySelector(`[data-cell-id="${cellId}"]`);
    if (cellElement) {
      setCaretPosition(cellElement, lastCaretPositionRef.current);
    }
  };

  const setCaretPosition = (element, position) => {
    const range = document.createRange();
    const selection = window.getSelection();
    selection.removeAllRanges();

    if (position === -1) {
      range.selectNodeContents(element);
      range.collapse(false);
    } else {
      const textNode = element.childNodes[0];
      range.setStart(textNode, position);
    }

    selection.addRange(range);
  };

  useEffect(() => {
    if (isTypingRef.current && currentEditCellRef.current) {
      restoreCaretPosition(currentEditCellRef.current);
      isTypingRef.current = false;
    }
  }, [formulaBarValue]);

  return { handleCellInput };
};

export default useCellEditing;