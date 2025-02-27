// filepath: /zeotap-google-sheets/zeotap-google-sheets/src/utils/types.ts

export type CellData = {
  [key: string]: string; // Maps cell IDs to their content
};

export type ColumnWidths = {
  [key: string]: number; // Maps column letters to their widths
};

export type RowHeights = {
  [key: number]: number; // Maps row numbers to their heights
};

export type FormulaError = {
  [key: string]: string; // Maps cell IDs to their formula error messages
};

export type SelectedCells = string[]; // Array of selected cell IDs

export type SpreadsheetState = {
  cellData: CellData;
  columnWidths: ColumnWidths;
  rowHeights: RowHeights;
  formulaError: FormulaError;
  selectedCells: SelectedCells;
  selectedCell: string | null;
  selectedRow: number | null;
  selectedColumn: string | null;
};