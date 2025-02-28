import React from "react";
import { FaPaintBrush, FaPrint, FaRedo, FaUndo } from "react-icons/fa";

const Toolbar = () => {
  return (
    <div className="bg-gray-50 text-gray-900 px-4 pb-2">
      <div className="flex items-center gap-4 bg-blue-50 h-12 px-4 rounded-full text-xs">
        <button className="p-2 hover:bg-gray-100 rounded">
          <FaUndo />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <FaRedo />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <FaPrint />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <FaPaintBrush />
        </button>

        <select className="border rounded px-2 py-1">
          <option>100%</option>
          <option>75%</option>
          <option>50%</option>
        </select>

        <select className="border rounded px-2 py-1 min-w-[120px] flex items-center">
          <option>Arial</option>
          <option>Times New Roman</option>
          <option>Calibri</option>
        </select>

        <select className="border rounded px-2 py-1 w-16">
          <option>10</option>
          <option>11</option>
          <option>12</option>
        </select>
      </div>
    </div>
  );
};

export default Toolbar;
