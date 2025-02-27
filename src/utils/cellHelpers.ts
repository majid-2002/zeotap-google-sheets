const parseCellReference = (cellId: string): { column: string; row: number } => {
    const column = cellId.match(/[A-Z]+/)?.[0] || "";
    const row = parseInt(cellId.replace(/[A-Z]+/, "")) || 0;
    return { column, row };
};

const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") return value.toString();
    return value.toString();
};

const isCellReference = (value: string): boolean => {
    const cellRefPattern = /^[A-Z]+\d+$/;
    return cellRefPattern.test(value);
};

export { parseCellReference, formatCellValue, isCellReference };