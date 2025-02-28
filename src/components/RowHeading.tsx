import React from "react";

interface RowHeadingProps {
  columns: string[];
  selectedColumn: string | null;
  columnWidths: Record<string, number>;
  resizeRef: React.RefObject<{
    currentColumn: string | null;
  }>;
  handleColumnResizeStart: (e: React.MouseEvent, column: string) => void;
}

const RowHeading: React.FC<RowHeadingProps> = ({
  columns,
  selectedColumn,
  columnWidths,
  resizeRef,
  handleColumnResizeStart,
}) => {
  return (
    <tr>
      <th className="w-10 bg-white sticky top-0 left-0 z-20 border border-b-4 border-r-4 border-gray-300"></th>
      {columns.map((column: string) => (
        <th
          key={column}
          className={` bg-white sticky top-0 z-10 border border-gray-300 text-xs text-gray-700 py-1.5
                    ${
                        selectedColumn === column
                        ? "bg-blue-200"
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
  );
};

export default RowHeading;
