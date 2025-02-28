import React, { JSX } from "react";
import Cell from "./Cell";
import RowResizeHandle from "./RowResizeHandle";

interface RowProps {
  row: number;
  columns: string[];
  selectedRow?: number | null;
  columnWidths: { [key: string]: number };
  rowHeights: { [key: number]: number };
  cellData: { [key: string]: string };
  selectedCell: string | null;
  formulaError: { [key: string]: string };
  handleRowResizeStart: (e: React.MouseEvent, row: number) => void;
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
  resizeRef: React.MutableRefObject<{ currentRow: number | null }>;
}

const Row = ({
  row,
  columns,
  selectedRow,
  handleRowResizeStart,
  cellData,
  selectedCell,
  formulaError,
  rowHeights,
  columnWidths,
  renderCellContent,
  handleCellInput,
  handleCellClick,
  resizeRef,
}: RowProps) => {
  return (
    <tr key={row}>
      <RowResizeHandle
        row={row}
        selectedRow={selectedRow}
        handleRowResizeStart={handleRowResizeStart}
        resizeRef={resizeRef}
      />
      {columns.map((column, colIndex) => {
        const cellId = `${column}${row}`;
        return (
          <Cell
            key={`${row}-${colIndex}`}
            cellId={cellId}
            column={column}
            row={row}
            selectedCell={selectedCell}
            cellData={cellData}
            formulaError={formulaError}
            renderCellContent={renderCellContent}
            handleCellInput={handleCellInput}
            handleCellClick={handleCellClick}
            columnWidths={columnWidths}
            rowHeights={rowHeights}
          />
        );
      })}
    </tr>
  );
};

export default Row;
