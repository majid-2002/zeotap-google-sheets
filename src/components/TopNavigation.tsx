import React from "react";


const TopNavigation = () => {
  return (
    <nav className="bg-gray-50">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2">
          <img
            src="https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png"
            alt="Sheets"
            className="h-12"
          />
          <div className="flex flex-col">
            <input
              type="text"
              defaultValue="Untitled spreadsheet"
              className="font-medium outline-none text-xl text-gray-900 bg-transparent "
            />
            <div className="flex items-center  py-1 gap-6 text-sm text-gray-600">
              <div>File</div>
              <div>Edit</div>
              <div>View</div>
              <div>Insert</div>
              <div>Format</div>
              <div>Data</div>
              <div>Tools</div>
              <div>Extensions</div>
              <div>Help</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
