import { useState, useCallback } from "react";

/**
 * Utility function to parse a cell range string into an array of cell IDs.
 *
 * @param range - The range string in the format "A1:B2".
 * @returns An array of cell IDs within the specified range.
 */
export const parseCellRange = (range: string): string[] => {
  const rangeRegex = /([A-Z]+)(\d+):([A-Z]+)(\d+)/;
  const match = range.match(rangeRegex);

  if (!match) return [];

  const [_, startCol, startRowStr, endCol, endRowStr] = match;
  const startRow = parseInt(startRowStr);
  const endRow = parseInt(endRowStr);

  const startColIndex = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(startCol);
  const endColIndex = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(endCol);

  if (startColIndex === -1 || endColIndex === -1) return [];

  const cellIds: string[] = [];

  for (let c = startColIndex; c <= endColIndex; c++) {
    const col = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[c];
    for (let r = startRow; r <= endRow; r++) {
      cellIds.push(`${col}${r}`);
    }
  }

  return cellIds;
};

/**
 * Utility function to get the numeric value of a cell content.
 *
 * @param cellValue - The content of the cell.
 * @returns The numeric value of the cell content, or 0 if it cannot be parsed.
 */
export const getNumericValue = (cellValue: string): number => {
  if (!cellValue) return 0;
  const parsed = parseFloat(cellValue);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Utility function to update the selection range based on the start and end cells.
 *
 * @param start - The starting cell ID.
 * @param end - The ending cell ID.
 * @returns The updated selection range.
 */
export const updateSelection = (start: string, end: string): string[] => {
  const startCol = start.match(/[A-Z]+/)?.[0] || "";
  const startRow = parseInt(start.replace(/[A-Z]+/, "")) || 0;
  const endCol = end.match(/[A-Z]+/)?.[0] || "";
  const endRow = parseInt(end.replace(endCol, "")) || 0;

  const startColIndex = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(startCol);
  const endColIndex = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(endCol);

  const minCol = Math.min(startColIndex, endColIndex);
  const maxCol = Math.max(startColIndex, endColIndex);
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);

  const newSelectedCells: string[] = [];

  for (let c = minCol; c <= maxCol; c++) {
    const col = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[c];
    for (let r = minRow; r <= maxRow; r++) {
      newSelectedCells.push(`${col}${r}`);
    }
  }

  return newSelectedCells;
};

/**
 * Utility function to generate a fill range based on the start and end cells.
 *
 * @param startCellId - The starting cell ID.
 * @param endCellId - The ending cell ID.
 * @returns The generated fill range.
 */
export const updateFillRange = (startCellId: string, endCellId: string): string[] => {
  const startCol = startCellId.match(/[A-Z]+/)?.[0] || "";
  const startRow = parseInt(startCellId.replace(/[A-Z]+/, "")) || 0;
  const endCol = endCellId.match(/[A-Z]+/)?.[0] || "";
  const endRow = parseInt(endCellId.replace(endCol, "")) || 0;

  const startColIndex = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(startCol);
  const endColIndex = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(endCol);

  const minCol = Math.min(startColIndex, endColIndex);
  const maxCol = Math.max(startColIndex, endColIndex);
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);

  const range: string[] = [];

  for (let c = minCol; c <= maxCol; c++) {
    const col = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[c];
    for (let r = minRow; r <= maxRow; r++) {
      range.push(`${col}${r}`);
    }
  }

  return range;
};