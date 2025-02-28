
const formulaUtils = {
  parseCellRange: (range: string): string[] => {
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
      for (let r = startRow; r <= endRow; r++) {
        const col = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[c];
        const cellId = `${col}${r}`;
        cellIds.push(cellId);
      }
    }

    return cellIds;
  },

  getNumericValue: (cellValue: string | undefined): number => {
    if (!cellValue) return 0;
    const parsed = parseFloat(cellValue);
    return isNaN(parsed) ? 0 : parsed;
  },

  adjustFormula: (
    formula: string,
    colOffset: number,
    rowOffset: number
  ): string => {
    // Pattern to match cell references like A1, B5, etc.
    const cellRefPattern = /([A-Z]+)(\d+)/g;

    return formula.replace(cellRefPattern, (match, col, row) => {
      // Convert column letter to index, add offset, convert back to letter
      const colIndex = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(col);
      const newColIndex = colIndex + colOffset;

      // Skip if out of bounds
      if (newColIndex < 0 || newColIndex >= 26) return match;

      const newCol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[newColIndex];
      const newRow = parseInt(row) + rowOffset;

      // Skip if row is invalid
      if (newRow <= 0) return match;

      return `${newCol}${newRow}`;
    });
  },

  evaluateFormula: (
    formula: string,
    cellData: Record<string, string>
  ): string => {
    // Remove the equals sign
    const expression = formula.substring(1).trim();

    try {
      // Handle SUM function
      if (expression.startsWith("SUM(") && expression.endsWith(")")) {
        const range = expression.substring(4, expression.length - 1);
        const cells = formulaUtils.parseCellRange(range);

        if (cells.length === 0) {
          // Handle individual cells separated by commas
          const individualCells = range.split(",").map((r) => r.trim());
          let sum = 0;

          individualCells.forEach((cell) => {
            if (cell.includes(":")) {
              // Handle ranges within comma-separated list
              sum += formulaUtils
                .parseCellRange(cell)
                .map((id) => formulaUtils.getNumericValue(cellData[id] || ""))
                .reduce((a, b) => a + b, 0);
            } else {
              sum += formulaUtils.getNumericValue(cellData[cell] || "");
            }
          });

          return sum.toString();
        }

        const sum = cells
          .map((id) => formulaUtils.getNumericValue(cellData[id] || ""))
          .reduce((a, b) => a + b, 0);

        return sum.toString();
      }

      if (expression.startsWith("AVERAGE(") && expression.endsWith(")")) {
        const range = expression.substring(8, expression.length - 1);
        const cells = formulaUtils.parseCellRange(range);

        if (cells.length === 0) {
          // Handle comma-separated values
          const individualCells = range.split(",").map((r) => r.trim());
          let sum = 0;
          let count = 0;

          individualCells.forEach((cell) => {
            if (cell.includes(":")) {
              // Handle ranges within comma-separated list
              const rangeCells = formulaUtils.parseCellRange(cell);
              sum += rangeCells
                .map((id) => formulaUtils.getNumericValue(cellData[id] || ""))
                .reduce((a, b) => a + b, 0);
              count += rangeCells.length;
            } else {
              sum += formulaUtils.getNumericValue(cellData[cell] || "");
              count++;
            }
          });

          return count > 0 ? (sum / count).toString() : "0";
        }

        const sum = cells
          .map((id) => formulaUtils.getNumericValue(cellData[id] || ""))
          .reduce((a, b) => a + b, 0);

        return cells.length > 0 ? (sum / cells.length).toString() : "0";
      }

      // Handle MAX function
      if (expression.startsWith("MAX(") && expression.endsWith(")")) {
        const range = expression.substring(4, expression.length - 1);
        const cells = formulaUtils.parseCellRange(range);

        if (cells.length === 0) {
          // Handle comma-separated values
          const individualCells = range.split(",").map((r) => r.trim());
          let values: number[] = [];

          individualCells.forEach((cell) => {
            if (cell.includes(":")) {
              const rangeCells = formulaUtils.parseCellRange(cell);
              values = values.concat(
                rangeCells.map((id) =>
                  formulaUtils.getNumericValue(cellData[id] || "")
                )
              );
            } else {
              values.push(formulaUtils.getNumericValue(cellData[cell] || ""));
            }
          });

          return values.length > 0 ? Math.max(...values).toString() : "0";
        }

        const values = cells.map((id) =>
          formulaUtils.getNumericValue(cellData[id] || "")
        );
        return values.length > 0 ? Math.max(...values).toString() : "0";
      }

      // Handle MIN function
      if (expression.startsWith("MIN(") && expression.endsWith(")")) {
        const range = expression.substring(4, expression.length - 1);
        const cells = formulaUtils.parseCellRange(range);

        if (cells.length === 0) {
          // Handle comma-separated values
          const individualCells = range.split(",").map((r) => r.trim());
          let values: number[] = [];

          individualCells.forEach((cell) => {
            if (cell.includes(":")) {
              const rangeCells = formulaUtils.parseCellRange(cell);
              values = values.concat(
                rangeCells.map((id) =>
                  formulaUtils.getNumericValue(cellData[id] || "")
                )
              );
            } else {
              values.push(formulaUtils.getNumericValue(cellData[cell] || ""));
            }
          });

          return values.length > 0 ? Math.min(...values).toString() : "0";
        }

        const values = cells.map((id) =>
          formulaUtils.getNumericValue(cellData[id] || "")
        );
        return values.length > 0 ? Math.min(...values).toString() : "0";
      }

      // Handle COUNT function
      if (expression.startsWith("COUNT(") && expression.endsWith(")")) {
        const range = expression.substring(6, expression.length - 1);
        const cells = formulaUtils.parseCellRange(range);

        if (cells.length === 0) {
          // Handle comma-separated values
          const individualCells = range.split(",").map((r) => r.trim());
          let count = 0;

          individualCells.forEach((cell) => {
            if (cell.includes(":")) {
              const rangeCells = formulaUtils.parseCellRange(cell);
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

      return formula;
    } catch (error) {
      return "Error in formula";
    }
  },
};

export default formulaUtils;
