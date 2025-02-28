import React from "react";

interface CellProps {
  cellId: string;
  column: string;
  row: number;
  selectedCell: string | null;
  cellData: { [key: string]: string };
  formulaError: { [key: string]: string };
  columnWidths: { [key: string]: number };
  rowHeights: { [key: number]: number };
  renderCellContent: (cellId: string) => React.ReactNode;
  handleCellInput: (
    e: React.ChangeEvent<HTMLInputElement>,
    cellId: string
  ) => void;
  handleCellClick: (
    column: string,
    row: number,
    e: React.MouseEvent<HTMLTableCellElement>
  ) => void;
}

const Cell = ({
  cellId,
  column,
  row,
  selectedCell,
  cellData,
  columnWidths,
  rowHeights,
  formulaError,
  renderCellContent,
  handleCellInput,
  handleCellClick,
}: CellProps) => {
  return (
    <td
      key={`${row}-${column}`}
      data-cell-id={cellId}
      className={`border bg-white text-gray-700 outline-none relative ${
        selectedCell === cellId
          ? "border-[2.8px] border-blue-600"
          : "border-gray-200"
      } ${selectedCell === cellId ? "overflow-visible" : "overflow-hidden"} 
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
      onClick={(e) => handleCellClick(column, row, e)}
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
    </td>
  );
};

export default Cell;
