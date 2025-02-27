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

const getNumericValue = (cellValue: string): number => {
    if (!cellValue) return 0;
    const parsed = parseFloat(cellValue);
    return isNaN(parsed) ? 0 : parsed;
};

const evaluateFormula = (formula: string, cellId: string): string => {
    const expression = formula.substring(1).trim();

    try {
        if (expression.startsWith("SUM(") && expression.endsWith(")")) {
            const range = expression.substring(4, expression.length - 1);
            const cells = parseCellRange(range);
            const sum = cells.map((id) => getNumericValue(cellData[id] || "")).reduce((a, b) => a + b, 0);
            return sum.toString();
        }

        if (expression.startsWith("AVERAGE(") && expression.endsWith(")")) {
            const range = expression.substring(8, expression.length - 1);
            const cells = parseCellRange(range);
            const sum = cells.map((id) => getNumericValue(cellData[id] || "")).reduce((a, b) => a + b, 0);
            return cells.length > 0 ? (sum / cells.length).toString() : "0";
        }

        // Additional functions like MAX, MIN, COUNT can be added here

        return formula; // Return the formula if it can't be evaluated
    } catch (error) {
        return formula; // Return the formula in case of an error
    }
};

export { parseCellRange, getNumericValue, evaluateFormula };