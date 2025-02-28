import React, { useState } from "react";

interface FormulaBarProps {
  value: string ;
  handleFormulaBarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCell?: string | null;
  initialSelectedCell?: string;
}

const FormulaBar = ({
  value,
  handleFormulaBarChange,
  selectedCell = "A1",
  initialSelectedCell = "A1",
}: FormulaBarProps) => {

  return (
    <div className="flex items-center px-2 py-1 border-b border-gray-200 bg-white">
      <div className="px-2 pt-1 font-bold text-gray-500 w-14 text-md">
        {selectedCell || initialSelectedCell}
      </div>
      <div className="flex items-center flex-1 px-2">
        <div className="px-2 text-gray-500 font-bold">
          <span className="inline-block  px-1 rounded text-base italic font-serif mr-1">
            fx
          </span>
        </div>
        <input
          type="text"
          className="w-full border p-1 text-gray-700 outline-none border-none"
          value={value}
          onChange={handleFormulaBarChange}
        />
      </div>
    </div>
  );
};

export default FormulaBar;
