import React, { createContext, useContext, useState } from 'react';

interface SpreadsheetContextType {
  cellData: { [key: string]: string };
  setCellData: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  selectedCell: string | null;
  setSelectedCell: React.Dispatch<React.SetStateAction<string | null>>;
  selectedCells: string[];
  setSelectedCells: React.Dispatch<React.SetStateAction<string[]>>;
  formulaBarValue: string;
  setFormulaBarValue: React.Dispatch<React.SetStateAction<string>>;
}

const SpreadsheetContext = createContext<SpreadsheetContextType | undefined>(undefined);

export const SpreadsheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cellData, setCellData] = useState<{ [key: string]: string }>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [formulaBarValue, setFormulaBarValue] = useState<string>("");

  return (
    <SpreadsheetContext.Provider
      value={{
        cellData,
        setCellData,
        selectedCell,
        setSelectedCell,
        selectedCells,
        setSelectedCells,
        formulaBarValue,
        setFormulaBarValue,
      }}
    >
      {children}
    </SpreadsheetContext.Provider>
  );
};

export const useSpreadsheetContext = (): SpreadsheetContextType => {
  const context = useContext(SpreadsheetContext);
  if (!context) {
    throw new Error('useSpreadsheetContext must be used within a SpreadsheetProvider');
  }
  return context;
};