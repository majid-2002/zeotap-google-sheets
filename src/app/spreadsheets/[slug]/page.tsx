"use client";

import FormulaBar from "@/components/FormulaBar";
import Row from "@/components/Row";
import RowHeading from "@/components/RowHeading";
import Toolbar from "@/components/Toolbar";
import TopNavigation from "@/components/TopNavigation";
import formulaUtils from "@/utils/formulaUtils";
import React, { JSX, useEffect, useRef } from "react";

const SpreadsheetPage = () => {
  const columns = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const rows = Array.from({ length: 100 }, (_, i) => i + 1);

  const initialSelectedCell = "A1";
  const initialSelectedColumn = "A";
  const initialSelectedRow = 1;

  // Add state for cell data
  const [cellData, setCellData] = React.useState<{ [key: string]: string }>({});
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

  // Add this new state for formula evaluation
  const [formulaError, setFormulaError] = React.useState<{
    [key: string]: string;
  }>({});

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

    currentEditCellRef.current = cellId;
  };

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

  const handleCellClick = (
    column: string,
    row: number,
    e: React.MouseEvent<HTMLTableCellElement>
  ) => {
    const cellId = `${column}${row}`;
    setSelectedCell(cellId);
    setSelectedRow(row);
    setSelectedColumn(column);
    setFormulaBarValue(cellData[cellId] || "");

    selectedCellRef.current = e.currentTarget;
    currentEditCellRef.current = null;
  };

  const handleFormulaBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setFormulaBarValue(newValue);

    if (selectedCell) {
      currentEditCellRef.current = selectedCell;

      setCellData((prev) => ({
        ...prev,
        [selectedCell]: newValue,
      }));
    }
  };

  const renderCellContent = (cellId: string): JSX.Element | string => {
    const content = cellData[cellId] || "";

    if (!content.startsWith("=")) return content;

    if (selectedCell === cellId) return content;

    return formulaUtils.evaluateFormula(content, cellData);
  };

  return (
    <div className="h-screen flex flex-col">
      <TopNavigation />
      <Toolbar />
      <FormulaBar
        value={formulaBarValue}
        handleFormulaBarChange={handleFormulaBarChange}
        selectedCell={selectedCell}
        initialSelectedCell={initialSelectedCell}
      />

      <div className="flex-1 overflow-auto bg-green-50">
        <table className="border-collapse">
          <thead>
            <RowHeading
              columns={columns}
              selectedColumn={selectedColumn}
              columnWidths={columnWidths}
              resizeRef={resizeRef}
              handleColumnResizeStart={handleColumnResizeStart}
            />
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <Row
                key={index}
                row={row}
                columns={columns}
                selectedRow={selectedRow}
                columnWidths={columnWidths}
                rowHeights={rowHeights}
                cellData={cellData}
                selectedCell={selectedCell}
                formulaError={formulaError}
                handleRowResizeStart={handleRowResizeStart}
                renderCellContent={renderCellContent}
                handleCellInput={handleCellInput}
                handleCellClick={handleCellClick}
                resizeRef={resizeRef}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpreadsheetPage;
