"use client";

import React, { JSX, useEffect, useRef } from "react";
import { FaUndo, FaRedo, FaPrint, FaPaintBrush } from "react-icons/fa";
import { BiSolidDownArrow } from "react-icons/bi";

const SpreadsheetPage = () => {
  const columns = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const rows = Array.from({ length: 100 }, (_, i) => i + 1);

  // Initialize with A1 selected
  const initialSelectedCell = "A1";
  const initialSelectedColumn = "A";
  const initialSelectedRow = 1;

  // Add state for cell data
  const [cellData, setCellData] = React.useState<{ [key: string]: string }>({});
  const [draggedContent, setDraggedContent] = React.useState<string>("");
  const [draggedCell, setDraggedCell] = React.useState<string>("");

  // Add ref for formula input to maintain cursor position
  const cursorPositionRef = useRef<number | null>(null);

  // Add a ref for the currently selected cell element
  const selectedCellRef = useRef<HTMLTableCellElement | null>(null);

  // Update state to track selected row and column with initial values
  const [selectedCell, setSelectedCell] = React.useState<string | null>(
    initialSelectedCell
  );
  const [selectedRow, setSelectedRow] = React.useState<number | null>(
    initialSelectedRow
  );
  const [selectedColumn, setSelectedColumn] = React.useState<string | null>(
    initialSelectedColumn
  );

  // Add state for column widths and row heights
  const [columnWidths, setColumnWidths] = React.useState<{
    [key: string]: number;
  }>(() => Object.fromEntries(columns.map((col) => [col, 100])));
  const [rowHeights, setRowHeights] = React.useState<{ [key: number]: number }>(
    () => Object.fromEntries(rows.map((row) => [row, 24]))
  );

  // Add these new state variables at the top of your component
  const [selectionStart, setSelectionStart] = React.useState<string | null>(
    null
  );
  const [selectionEnd, setSelectionEnd] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [dragMode, setDragMode] = React.useState<"move" | "copy" | "fill">(
    "move"
  );
  const [selectedCells, setSelectedCells] = React.useState<string[]>([]);

  // Add this new state for formula evaluation
  const [formulaError, setFormulaError] = React.useState<{
    [key: string]: string;
  }>({});

  // Add these new state variables for fill handle functionality
  const [isFillDragging, setIsFillDragging] = React.useState<boolean>(false);
  const [fillStartCell, setFillStartCell] = React.useState<string | null>(null);
  const [fillRange, setFillRange] = React.useState<string[]>([]);

  // Add a new state for formula bar value
  const [formulaBarValue, setFormulaBarValue] = React.useState<string>("");

  // Use effect to focus A1 cell when component mounts
  useEffect(() => {
    // Set A1 as the initially selected cell
    setSelectedCell(initialSelectedCell);
    setSelectedRow(initialSelectedRow);
    setSelectedColumn(initialSelectedColumn);

    // Try to focus the A1 cell (optional)
    try {
      const cellElement = document.querySelector(
        `[data-cell-id="${initialSelectedCell}"]`
      ) as HTMLElement;
      if (cellElement) {
        cellElement.focus();
      }
    } catch (e) {
      console.log("Could not focus initial cell");
    }
  }, []);

  // Add ref for tracking resize state
  const resizeRef = React.useRef({
    isResizing: false,
    initialX: 0,
    initialY: 0,
    initialWidth: 0,
    initialHeight: 0,
    currentColumn: null as string | null,
    currentRow: null as number | null,
  });

  // Store the currently being edited cell ID
  const currentEditCellRef = useRef<string | null>(null);

  // Enhanced cell content handler with better cursor positioning
  // Simpler cell input handler that doesn't try to manage cursor position
  const handleCellInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    cellId: string
  ) => {
    const newContent = e.target.value;

    // Update both the cell data and formula bar
    setCellData((prev) => ({
      ...prev,
      [cellId]: newContent,
    }));

    // Update formula bar if this is the selected cell
    if (selectedCell === cellId) {
      setFormulaBarValue(newContent);
    }

    // Clear any formula errors
    if (formulaError[cellId]) {
      setFormulaError((prev) => {
        const newErrors = { ...prev };
        delete newErrors[cellId];
        return newErrors;
      });
    }

    // Track which cell is being edited
    currentEditCellRef.current = cellId;
  };

  // Update column resize handler
  const handleColumnResizeStart = (e: React.MouseEvent, column: string) => {
    e.preventDefault();
    e.stopPropagation();

    const resizeState = resizeRef.current;
    resizeState.isResizing = true;
    resizeState.initialX = e.clientX;
    resizeState.currentColumn = column;
    resizeState.initialWidth = columnWidths[column];

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeState.isResizing || !resizeState.currentColumn) return;

      const diff = e.clientX - resizeState.initialX;
      const newWidth = Math.max(50, resizeState.initialWidth + diff);

      setColumnWidths((prev) => ({
        ...prev,
        [resizeState.currentColumn!]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      resizeState.isResizing = false;
      resizeState.currentColumn = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Update row resize handler
  const handleRowResizeStart = (e: React.MouseEvent, row: number) => {
    e.preventDefault();
    e.stopPropagation();

    const resizeState = resizeRef.current;
    resizeState.isResizing = true;
    resizeState.initialY = e.clientY;
    resizeState.currentRow = row;
    resizeState.initialHeight = rowHeights[row];

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeState.isResizing || !resizeState.currentRow) return;

      const diff = e.clientY - resizeState.initialY;
      const newHeight = Math.max(24, resizeState.initialHeight + diff);

      setRowHeights((prev) => ({
        ...prev,
        [resizeState.currentRow!]: newHeight,
      }));
    };

    const handleMouseUp = () => {
      resizeState.isResizing = false;
      resizeState.currentRow = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Update click handler to set both row and column and keep focus on cell
  const handleCellClick = (
    column: string,
    row: number,
    e: React.MouseEvent<HTMLTableCellElement>
  ) => {
    const cellId = `${column}${row}`;
    setSelectedCell(cellId);
    setSelectedRow(row);
    setSelectedColumn(column);

    // Update formula bar with cell content
    setFormulaBarValue(cellData[cellId] || "");

    selectedCellRef.current = e.currentTarget;

    // Clear any previous editing state
    currentEditCellRef.current = null;
  };

  // Improved function to focus a cell by ID with cursor at end
  const focusCellById = (cellId: string) => {
    const cellElement = document.querySelector(
      `[data-cell-id="${cellId}"]`
    ) as HTMLTableCellElement;

    if (cellElement) {
      cellElement.focus();
    }
  };

  // Handle formula bar input change
  // Update the handleFormulaBarChange function to mark the cell as being edited
  const handleFormulaBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Update the formula bar state
    setFormulaBarValue(newValue);

    // Update the cell content if a cell is selected
    if (selectedCell) {
      // Mark the cell as being edited through the formula bar
      currentEditCellRef.current = selectedCell;

      setCellData((prev) => ({
        ...prev,
        [selectedCell]: newValue,
      }));
    }
  };

  // Keep a reference to any drag preview elements we create
  const dragPreviewRef = useRef<HTMLDivElement | null>(null);

  // Enhanced drag start handler
  const handleDragStart = (
    e: React.DragEvent<HTMLTableCellElement>,
    cellId: string
  ) => {
    e.dataTransfer.setData("text/plain", cellId);
    setDraggedCell(cellId);
    setDraggedContent(cellData[cellId] || "");

    // Check if we're dragging from selection or single cell
    if (selectedCells.includes(cellId)) {
      // We're dragging a selection
      e.dataTransfer.setData(
        "application/x-selection",
        JSON.stringify(selectedCells)
      );
    } else {
      // Single cell drag
      setSelectedCells([cellId]);
    }

    // Default to move operation
    e.dataTransfer.effectAllowed = "copyMove";
    setIsDragging(true);

    // Clean up any existing preview element
    if (dragPreviewRef.current && dragPreviewRef.current.parentElement) {
      dragPreviewRef.current.parentElement.removeChild(dragPreviewRef.current);
    }

    // Add custom drag image to show what's being dragged
    const dragPreview = document.createElement("div");
    dragPreviewRef.current = dragPreview;

    dragPreview.className =
      "bg-blue-100 border border-blue-500 opacity-70 p-1 text-xs";
    dragPreview.textContent = `${
      selectedCells.length > 1
        ? selectedCells.length + " cells"
        : cellData[cellId] || ""
    }`;
    dragPreview.style.position = "absolute";
    dragPreview.style.top = "-1000px";
    dragPreview.style.left = "-1000px";
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);

    // Use requestAnimationFrame for smoother cleanup
    requestAnimationFrame(() => {
      // The element needs to stay in the DOM during the drag operation
      // We'll remove it on drop or dragend events
    });
  };

  // Enhanced drop handler with support for selections and formulas
  const handleDrop = (
    e: React.DragEvent<HTMLTableCellElement>,
    targetCellId: string
  ) => {
    e.preventDefault();
    setIsDragging(false);
    e.currentTarget.classList.remove("bg-blue-50");

    // Clean up the drag preview
    if (dragPreviewRef.current && dragPreviewRef.current.parentElement) {
      try {
        dragPreviewRef.current.parentElement.removeChild(
          dragPreviewRef.current
        );
      } catch (error) {
        // Ignore errors during cleanup
      }
    }

    if (!draggedCell) return;

    // Parse cell coordinates
    const sourceCol = draggedCell.match(/[A-Z]+/)?.[0] || "";
    const sourceRow = parseInt(draggedCell.replace(sourceCol, "")) || 0;
    const targetCol = targetCellId.match(/[A-Z]+/)?.[0] || "";
    const targetRow = parseInt(targetCellId.replace(targetCol, "")) || 0;

    // Calculate offset for formula adjustment
    const colOffset = columns.indexOf(targetCol) - columns.indexOf(sourceCol);
    const rowOffset = targetRow - sourceRow;

    if (selectedCells.length > 1) {
      // Handle multiple cell selection
      const newCellData = { ...cellData };

      // Get selection bounds
      const selCols = selectedCells.map(
        (cid) => cid.match(/[A-Z]+/)?.[0] || ""
      );
      const selRows = selectedCells.map(
        (cid) => parseInt(cid.replace(/[A-Z]+/, "")) || 0
      );

      // Calculate min and max bounds for the selection
      const minCol = Math.min(...selCols.map((col) => columns.indexOf(col)));
      const minRow = Math.min(...selRows);

      selectedCells.forEach((cellId) => {
        const cellCol = cellId.match(/[A-Z]+/)?.[0] || "";
        const cellRow = parseInt(cellId.replace(cellCol, "")) || 0;

        // Calculate target position
        const cellColIndex = columns.indexOf(cellCol);
        const relColIndex = cellColIndex - minCol;
        const relRowIndex = cellRow - minRow;

        const targetColIndex = columns.indexOf(targetCol) + relColIndex;
        const targetRowIndex = targetRow + relRowIndex;

        if (targetColIndex >= 0 && targetColIndex < columns.length) {
          const targetCellId = `${columns[targetColIndex]}${targetRowIndex}`;
          const content = cellData[cellId] || "";

          // Adjust formulas if needed
          const adjustedContent = content.startsWith("=")
            ? adjustFormula(content, colOffset, rowOffset)
            : content;

          newCellData[targetCellId] = adjustedContent;

          // Clear source cells if in move mode
          if (dragMode === "move") {
            newCellData[cellId] = "";
          }
        }
      });

      setCellData(newCellData);
    } else {
      // Simple single cell operation
      const content = cellData[draggedCell] || "";

      // Adjust formula if needed
      const adjustedContent = content.startsWith("=")
        ? adjustFormula(content, colOffset, rowOffset)
        : content;

      setCellData((prev) => {
        const newData = { ...prev };
        newData[targetCellId] = adjustedContent;

        // Only clear original cell if we're in move mode
        if (dragMode === "move") {
          newData[draggedCell] = "";
        }

        return newData;
      });
    }

    // Focus the target cell
    focusCellById(targetCellId);
  };

  // Also add a dragEnd handler to make sure cleanup happens even if drop doesn't fire
  const handleDragEnd = () => {
    // Clean up the drag preview
    if (dragPreviewRef.current && dragPreviewRef.current.parentElement) {
      try {
        dragPreviewRef.current.parentElement.removeChild(
          dragPreviewRef.current
        );
      } catch (error) {
        // Ignore errors during cleanup
      }
    }

    setIsDragging(false);
  };

  // Helper function to adjust formula cell references
  const adjustFormula = (
    formula: string,
    colOffset: number,
    rowOffset: number
  ): string => {
    // Pattern to match cell references like A1, B5, etc.
    const cellRefPattern = /([A-Z]+)(\d+)/g;

    return formula.replace(cellRefPattern, (match, col, row) => {
      // Convert column letter to index, add offset, convert back to letter
      const colIndex = columns.indexOf(col);
      const newColIndex = colIndex + colOffset;

      // Skip if out of bounds
      if (newColIndex < 0 || newColIndex >= columns.length) return match;

      const newCol = columns[newColIndex];
      const newRow = parseInt(row) + rowOffset;

      // Skip if row is invalid
      if (newRow <= 0) return match;

      return `${newCol}${newRow}`;
    });
  };

  // Add selection handling for multiple cells
  const handleMouseDown = (
    e: React.MouseEvent<HTMLTableCellElement>,
    cellId: string
  ) => {
    // Start selection
    setSelectionStart(cellId);
    setSelectionEnd(cellId);
    setSelectedCells([cellId]);

    // Standard cell click handling
    const column = cellId.match(/[A-Z]+/)?.[0] || "";
    const row = parseInt(cellId.replace(/[A-Z]+/, "")) || 0;
    handleCellClick(column, row, e);

    // Don't start selection if we're clicking the fill handle
    if (
      e.target instanceof Element &&
      e.target.closest('[data-fill-handle="true"]')
    ) {
      return;
    }

    // Add mouse move handler for selection
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const elementUnderMouse = document.elementFromPoint(
        moveEvent.clientX,
        moveEvent.clientY
      );

      if (elementUnderMouse) {
        const cellElement = elementUnderMouse.closest("[data-cell-id]");
        if (cellElement instanceof Element) {
          const targetCellId = cellElement.getAttribute("data-cell-id") || "";
          if (targetCellId) {
            // Update selection range
            updateSelection(cellId, targetCellId);
            setSelectionEnd(targetCellId);
          }
        }
      }
    };

    // Add mouse up handler to end selection
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Helper to update selection range
  const updateSelection = (start: string, end: string) => {
    const startCol = start.match(/[A-Z]+/)?.[0] || "";
    const startRow = parseInt(start.replace(/[A-Z]+/, "")) || 0;
    const endCol = end.match(/[A-Z]+/)?.[0] || "";
    const endRow = parseInt(end.replace(endCol, "")) || 0;

    const startColIndex = columns.indexOf(startCol);
    const endColIndex = columns.indexOf(endCol);

    // Calculate minimum and maximum bounds
    const minCol = Math.min(startColIndex, endColIndex);
    const maxCol = Math.max(startColIndex, endColIndex);
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);

    const newSelectedCells: string[] = [];

    for (let c = minCol; c <= maxCol; c++) {
      for (let r = minRow; r <= maxRow; r++) {
        newSelectedCells.push(`${columns[c]}${r}`);
      }
    }

    setSelectedCells(newSelectedCells);
  };

  // Add these utility functions for formula parsing and evaluation

  // Parse a cell reference range like "A1:B5" into an array of cell IDs
  const parseCellRange = (range: string): string[] => {
    const rangeRegex = /([A-Z]+)(\d+):([A-Z]+)(\d+)/;
    const match = range.match(rangeRegex);

    if (!match) return [];

    const [_, startCol, startRowStr, endCol, endRowStr] = match;
    const startRow = parseInt(startRowStr);
    const endRow = parseInt(endRowStr);

    const startColIndex = columns.indexOf(startCol);
    const endColIndex = columns.indexOf(endCol);

    if (startColIndex === -1 || endColIndex === -1) return [];

    const cellIds: string[] = [];

    for (let c = startColIndex; c <= endColIndex; c++) {
      for (let r = startRow; r <= endRow; r++) {
        cellIds.push(`${columns[c]}${r}`);
      }
    }

    return cellIds;
  };

  // Get numeric value from a cell (handle empty cells and text)
  const getNumericValue = (cellValue: string): number => {
    if (!cellValue) return 0;
    const parsed = parseFloat(cellValue);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Implement formula evaluation
  const evaluateFormula = (formula: string, cellId: string): string => {
    // Remove the equals sign
    const expression = formula.substring(1).trim();

    try {
      // Handle SUM function
      if (expression.startsWith("SUM(") && expression.endsWith(")")) {
        const range = expression.substring(4, expression.length - 1);
        const cells = parseCellRange(range);

        if (cells.length === 0) {
          // Handle individual cells separated by commas
          const individualCells = range.split(",").map((r) => r.trim());
          let sum = 0;

          individualCells.forEach((cell) => {
            if (cell.includes(":")) {
              // Handle ranges within comma-separated list
              sum += parseCellRange(cell)
                .map((id) => getNumericValue(cellData[id] || ""))
                .reduce((a, b) => a + b, 0);
            } else {
              sum += getNumericValue(cellData[cell] || "");
            }
          });

          return sum.toString();
        }

        const sum = cells
          .map((id) => getNumericValue(cellData[id] || ""))
          .reduce((a, b) => a + b, 0);

        return sum.toString();
      }

      // Handle AVERAGE function
      if (expression.startsWith("AVERAGE(") && expression.endsWith(")")) {
        const range = expression.substring(8, expression.length - 1);
        const cells = parseCellRange(range);

        if (cells.length === 0) {
          // Handle comma-separated values
          const individualCells = range.split(",").map((r) => r.trim());
          let sum = 0;
          let count = 0;

          individualCells.forEach((cell) => {
            if (cell.includes(":")) {
              // Handle ranges within comma-separated list
              const rangeCells = parseCellRange(cell);
              sum += rangeCells
                .map((id) => getNumericValue(cellData[id] || ""))
                .reduce((a, b) => a + b, 0);
              count += rangeCells.length;
            } else {
              sum += getNumericValue(cellData[cell] || "");
              count++;
            }
          });

          return count > 0 ? (sum / count).toString() : "0";
        }

        const sum = cells
          .map((id) => getNumericValue(cellData[id] || ""))
          .reduce((a, b) => a + b, 0);

        return cells.length > 0 ? (sum / cells.length).toString() : "0";
      }

      // Handle MAX function
      if (expression.startsWith("MAX(") && expression.endsWith(")")) {
        const range = expression.substring(4, expression.length - 1);
        const cells = parseCellRange(range);

        if (cells.length === 0) {
          // Handle comma-separated values
          const individualCells = range.split(",").map((r) => r.trim());
          let values: number[] = [];

          individualCells.forEach((cell) => {
            if (cell.includes(":")) {
              const rangeCells = parseCellRange(cell);
              values = values.concat(
                rangeCells.map((id) => getNumericValue(cellData[id] || ""))
              );
            } else {
              values.push(getNumericValue(cellData[cell] || ""));
            }
          });

          return values.length > 0 ? Math.max(...values).toString() : "0";
        }

        const values = cells.map((id) => getNumericValue(cellData[id] || ""));
        return values.length > 0 ? Math.max(...values).toString() : "0";
      }

      // Handle MIN function
      if (expression.startsWith("MIN(") && expression.endsWith(")")) {
        const range = expression.substring(4, expression.length - 1);
        const cells = parseCellRange(range);

        if (cells.length === 0) {
          // Handle comma-separated values
          const individualCells = range.split(",").map((r) => r.trim());
          let values: number[] = [];

          individualCells.forEach((cell) => {
            if (cell.includes(":")) {
              const rangeCells = parseCellRange(cell);
              values = values.concat(
                rangeCells.map((id) => getNumericValue(cellData[id] || ""))
              );
            } else {
              values.push(getNumericValue(cellData[cell] || ""));
            }
          });

          return values.length > 0 ? Math.min(...values).toString() : "0";
        }

        const values = cells.map((id) => getNumericValue(cellData[id] || ""));
        return values.length > 0 ? Math.min(...values).toString() : "0";
      }

      // Handle COUNT function
      if (expression.startsWith("COUNT(") && expression.endsWith(")")) {
        const range = expression.substring(6, expression.length - 1);
        const cells = parseCellRange(range);

        if (cells.length === 0) {
          // Handle comma-separated values
          const individualCells = range.split(",").map((r) => r.trim());
          let count = 0;

          individualCells.forEach((cell) => {
            if (cell.includes(":")) {
              const rangeCells = parseCellRange(cell);
              count += rangeCells.filter((id) => {
                const val = cellData[id] || "";
                return val !== "" && !isNaN(parseFloat(val));
              }).length;
            } else {
              const val = cellData[cell] || "";
              if (val !== "" && !isNaN(parseFloat(val))) count++;
            }
          });

          return count.toString();
        }

        const count = cells.filter((id) => {
          const val = cellData[id] || "";
          return val !== "" && !isNaN(parseFloat(val));
        }).length;

        return count.toString();
      }

      // Simple math expressions could be added here with a library like math.js

      // If we can't evaluate, return the formula as is
      setFormulaError({
        ...formulaError,
        [cellId]: "Unable to evaluate formula",
      });
      return formula;
    } catch (error) {
      setFormulaError({ ...formulaError, [cellId]: "Error in formula" });
      return formula;
    }
  };

  const handleFillHandleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    startCellId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Activate the fill-dragging mode
    setIsFillDragging(true);
    setFillStartCell(startCellId);
    setFillRange([startCellId]); // highlight just the start cell initially

    // Listen to mouse moves on the document
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const elementUnderMouse = document.elementFromPoint(
        moveEvent.clientX,
        moveEvent.clientY
      );
      const cellElement = elementUnderMouse?.closest("[data-cell-id]");
      if (cellElement) {
        const targetCellId = cellElement.getAttribute("data-cell-id") || "";
        if (targetCellId && fillStartCell) {
          // Generate and highlight the range
          updateFillRange(fillStartCell, targetCellId);
        }
      }
    };

    // When mouse is released, finalize the fill
    const handleMouseUp = (upEvent: MouseEvent) => {
      setIsFillDragging(false);
      // Perform the actual data fill operation here
      finalizeFill();

      // Cleanup
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const finalizeFill = () => {
    if (!fillStartCell || fillRange.length <= 1) return;

    // Get starting cell content
    const sourceContent = cellData[fillStartCell] || "";
    const sourceCol = fillStartCell.match(/[A-Z]+/)?.[0] || "";
    const sourceRow = parseInt(fillStartCell.replace(sourceCol, "")) || 0;

    // Create a new copy of the cell data to update
    const newCellData = { ...cellData };

    // Apply the pattern to all cells in the fill range
    fillRange.forEach((cellId) => {
      if (cellId === fillStartCell) return; // Skip source cell

      const targetCol = cellId.match(/[A-Z]+/)?.[0] || "";
      const targetRow = parseInt(cellId.replace(targetCol, "")) || 0;

      // Calculate offset for formula adjustment
      const colOffset = columns.indexOf(targetCol) - columns.indexOf(sourceCol);
      const rowOffset = targetRow - sourceRow;

      // If it's a formula, adjust cell references
      if (sourceContent.startsWith("=")) {
        newCellData[cellId] = adjustFormula(
          sourceContent,
          colOffset,
          rowOffset
        );
      }
      // If it's a number, try to continue sequence
      else if (!isNaN(parseFloat(sourceContent))) {
        const numValue = parseFloat(sourceContent);
        // Simple increment based on position difference
        newCellData[cellId] = (
          numValue + Math.max(colOffset, rowOffset)
        ).toString();
      }
      // Otherwise just copy the content
      else {
        newCellData[cellId] = sourceContent;
      }
    });

    // Update cell data with our changes
    setCellData(newCellData);

    // Clear the fill range after operation
    setFillRange([]);
  };

  // Enhance the cell renderer to display formula results
  const renderCellContent = (cellId: string): JSX.Element | string => {
    const content = cellData[cellId] || "";

    // If it's not a formula, just show the raw content
    if (!content.startsWith("=")) return content;

    // If we're editing this cell, show the raw formula
    if (selectedCell === cellId) return content;

    // Otherwise, evaluate and show the result
    return evaluateFormula(content, cellId);
  };

  // Add keyboard handler for tab navigation
  const handleCellKeyDown = (
    e: React.KeyboardEvent<HTMLTableCellElement>,
    cellId: string
  ) => {
    const column = cellId.match(/[A-Z]+/)?.[0] || "";
    const row = parseInt(cellId.replace(/[A-Z]+/, "")) || 0;

    if (e.key === "Tab") {
      e.preventDefault();

      // Move to next or previous cell depending on shift key
      const colIndex = columns.indexOf(column);
      let nextColIndex = e.shiftKey ? colIndex - 1 : colIndex + 1;
      let nextRow = row;

      // Handle row wrapping
      if (nextColIndex < 0) {
        nextColIndex = columns.length - 1;
        nextRow = Math.max(1, row - 1);
      } else if (nextColIndex >= columns.length) {
        nextColIndex = 0;
        nextRow = Math.min(rows.length, row + 1);
      }

      if (nextColIndex >= 0 && nextColIndex < columns.length) {
        const nextCellId = `${columns[nextColIndex]}${nextRow}`;

        // Update selection
        setSelectedCell(nextCellId);
        setSelectedColumn(columns[nextColIndex]);
        setSelectedRow(nextRow);
        setSelectedCells([nextCellId]);

        // Focus the new cell
        setTimeout(() => {
          focusCellById(nextCellId);
        }, 0);
      }
    }
  };

  // Update fill range during drag
  const updateFillRange = (startCellId: string, endCellId: string) => {
    const startCol = startCellId.match(/[A-Z]+/)?.[0] || "";
    const startRow = parseInt(startCellId.replace(/[A-Z]+/, "")) || 0;
    const endCol = endCellId.match(/[A-Z]+/)?.[0] || "";
    const endRow = parseInt(endCellId.replace(endCol, "")) || 0;

    const startColIndex = columns.indexOf(startCol);
    const endColIndex = columns.indexOf(endCol);

    const minCol = Math.min(startColIndex, endColIndex);
    const maxCol = Math.max(startColIndex, endColIndex);
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);

    const range: string[] = [];

    for (let c = minCol; c <= maxCol; c++) {
      for (let r = minRow; r <= maxRow; r++) {
        range.push(`${columns[c]}${r}`);
      }
    }

    setFillRange(range);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-gray-50">
        <div className="flex flex-col">
          {/* Menu Bar */}

          {/* Title and Icon Row */}
          <div className="flex items-center gap-2 px-4 py-2">
            <img
              src="https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png"
              alt="Sheets"
              className="h-12"
            />
            <div className="flex flex-col">
              <input
                type="text"
                defaultValue="Untitled spreadsheet"
                className="font-medium outline-none text-xl text-gray-900 bg-none rounded"
              />
              <div className="flex items-center  py-1 gap-6 text-sm text-gray-600">
                <div>File</div>
                <div>Edit</div>
                <div>View</div>
                <div>Insert</div>
                <div>Format</div>
                <div>Data</div>
                <div>Tools</div>
                <div>Extensions</div>
                <div>Help</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Toolbar */}
      <div className="bg-gray-50 text-gray-900 px-4 pb-2">
        <div className="flex items-center gap-4 bg-blue-50 h-12 px-4 rounded-full text-xs">
          <button className="p-2 hover:bg-gray-100 rounded">
            <FaUndo />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <FaRedo />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <FaPrint />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <FaPaintBrush />
          </button>

          <select className="border rounded px-2 py-1">
            <option>100%</option>
            <option>75%</option>
            <option>50%</option>
          </select>

          <select className="border rounded px-2 py-1 min-w-[120px] flex items-center">
            <option>Arial</option>
            <option>Times New Roman</option>
            <option>Calibri</option>
          </select>

          <select className="border rounded px-2 py-1 w-16">
            <option>10</option>
            <option>11</option>
            <option>12</option>
          </select>
        </div>
      </div>

      <div className="flex items-center px-2 py-1 border-b border-gray-200 bg-white">
        <div className="px-2 font-bold text-gray-500 w-20 text-sm">
          {selectedCell || initialSelectedCell}
        </div>
        <div className="flex items-center flex-1 px-2">
          <div className="px-2 text-gray-500 font-bold">
            <span className="inline-block  px-1 rounded text-base italic font-serif mr-1">
              fx
            </span>
          </div>
          <input
            type="text"
            className="w-full border p-1 text-gray-700 outline-none border-none"
            value={formulaBarValue}
            onChange={handleFormulaBarChange}
          />
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto bg-green-50">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="w-10 bg-white sticky top-0 left-0 z-20 border border-b-4 border-r-4 border-gray-300"></th>
              {columns.map((column) => (
                <th
                  key={column}
                  className={`relative bg-white  top-0 z-10 border border-gray-300 text-xs text-gray-700 py-1.5
                                        ${
                                          selectedColumn === column
                                            ? "bg-blue-100"
                                            : ""
                                        }`}
                  style={{ width: columnWidths[column] }}
                >
                  {column}
                  <div
                    className={`absolute top-0 right-[-2px] h-full w-[4px] cursor-col-resize 
                                            hover:bg-blue-400 active:bg-blue-600 z-30
                                            ${
                                              resizeRef.current
                                                .currentColumn === column
                                                ? "bg-blue-600"
                                                : ""
                                            }`}
                    onMouseDown={(e) => handleColumnResizeStart(e, column)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td
                  className={`relative bg-white  left-0 z-10 border border-gray-300 text-xs px-3 text-center text-gray-800
                                        ${
                                          selectedRow === row
                                            ? "bg-blue-100"
                                            : ""
                                        }`}
                >
                  {row}
                  <div
                    className={`absolute bottom-[-2px] left-0 w-full h-[4px] cursor-row-resize 
                                            hover:bg-blue-400 active:bg-blue-600 z-30
                                            ${
                                              resizeRef.current.currentRow ===
                                              row
                                                ? "bg-blue-600"
                                                : ""
                                            }`}
                    onMouseDown={(e) => handleRowResizeStart(e, row)}
                  />
                </td>
                {columns.map((column, colIndex) => {
                  const cellId = `${column}${row}`;

                  return (
                    <td
                      key={`${row}-${colIndex}`}
                      data-cell-id={cellId}
                      className={`border bg-white text-gray-700 outline-none relative
                        ${
                          selectedCell === cellId
                            ? "border-[2.8px] border-blue-600"
                            : "border-gray-200"
                        }
                        ${
                          selectedCell === cellId
                            ? "overflow-visible"
                            : "overflow-hidden"
                        }
                        ${fillRange.includes(cellId) ? "bg-blue-100" : ""}
                        ${formulaError[cellId] ? "border-red-500" : ""}`}
                      style={{
                        width: columnWidths[column],
                        height: rowHeights[row],
                        maxWidth: columnWidths[column],
                        minWidth: columnWidths[column],
                        padding: "0 4px",
                        position: "relative",
                        boxSizing: "border-box",
                      }}
                      // Remove contentEditable and its events – now using an input inside
                      onClick={(e) => handleCellClick(column, row, e)}
                      draggable={!isFillDragging}
                      onDragStart={(e) => handleDragStart(e, cellId)}
                      onDrop={(e) => handleDrop(e, cellId)}
                      onDragEnd={handleDragEnd}
                      onMouseDown={(e) => handleMouseDown(e, cellId)}
                      suppressContentEditableWarning={true}
                      title={formulaError[cellId] || ""}
                    >
                      {selectedCell === cellId ? (
                        <input
                          type="text"
                          value={cellData[cellId] || ""}
                          onChange={(e) => handleCellInput(e, cellId)}
                          autoFocus
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            outline: "none",
                            padding: 0,
                            margin: 0,
                            background: "transparent",
                            fontSize: "inherit",
                            fontFamily: "inherit",
                          }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%" }}>
                          {renderCellContent(cellId)}
                        </div>
                      )}

                      {/* Fill Handle */}
                      {selectedCell === cellId && (
                        <div
                          className="absolute w-4 h-4 cursor-crosshair z-10"
                          style={{
                            bottom: "-4px",
                            right: "-4px",
                            pointerEvents: "all",
                          }}
                          data-fill-handle="true"
                          onMouseDown={(e) =>
                            handleFillHandleMouseDown(e, cellId)
                          }
                        >
                          <div
                            className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full"
                            style={{ bottom: "-2px", right: "-2px" }}
                            data-fill-handle="true"
                          ></div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpreadsheetPage;
