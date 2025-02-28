import React from "react";

interface RowResizeHandleProps {
  row: number;
  selectedRow?: number | null;
  handleRowResizeStart: (e: React.MouseEvent, row: number) => void;
  resizeRef: React.MutableRefObject<{ currentRow: number | null }>;
}

const RowResizeHandle = ({
  row,
  handleRowResizeStart,
  selectedRow,
  resizeRef,
}: RowResizeHandleProps) => {
  return (
    <td
      className={`relative bg-white  left-0 z-10 border border-gray-300 text-xs px-3 text-center text-gray-800
                  ${selectedRow === row ? "bg-blue-200" : ""}`}
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
  );
};

export default RowResizeHandle;
