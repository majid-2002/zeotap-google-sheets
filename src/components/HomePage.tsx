import React from 'react';
import { FaGoogle, FaSearch, FaEllipsisV, FaRegCalendar } from 'react-icons/fa';
import { RxHamburgerMenu } from "react-icons/rx";
import { BsGrid3X3Gap } from 'react-icons/bs';

const HomePage = () => {
  const templates = [
    { name: 'Blank spreadsheet', content: '' },
    { name: 'Blank spreadsheet', content: '' },
    { name: 'Blank spreadsheet', content: '' },
    { name: 'Blank spreadsheet', content: '' },
    { name: 'Blank spreadsheet', content: '' },
    { name: 'Blank spreadsheet', content: '' },
  ];

  const recentFiles = [
    { name: 'Evaluation Results', date: '24 Feb 2025', shared: true },
    { name: 'Qstns Solved', date: '29 Jan 2025' },
    { name: 'Activity Points Details', date: '12 Dec 2024', shared: true },
    { name: 'Copy of Activity_points', date: '12 Dec 2024' },
    { name: 'Activity Points Details', date: '31 Aug 2024', shared: true }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center p-2 px-4 bg-white border-b border-gray-300">
        <div className="flex items-center gap-4">
          <button className="text-2xl bg-transparent border-none cursor-pointer text-gray-900">
            <RxHamburgerMenu />
          </button>
          <div className="flex items-center gap-2 text-gray-900">
            <img src="https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png" alt="Sheets" className="h-10 w-10" />
            <span className='text-xl pt-2'>Sheets</span>
          </div>
        </div>

        <div className="flex-1 max-w-3xl mx-auto relative text-gray-900">
          <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search" className="w-full  py-3 px-14 rounded-full border-none bg-gray-100 outline-none active:shadow-sm placeholder:text-gray-900" />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s" alt="Profile" className="w-full h-full" />
          </div>
        </div>
      </header>

      <main className="pt-6 w-full h-fit text-gray-600 font-medium">
        <div className='px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40'>
          <div className="flex justify-between items-center mb-4">
            <span className="text-base font-medium pl-1">Start a new spreadsheet</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            {templates.map((template, index) => (
              <div className='flex-col  flex gap-y-2' key={index}>
                <div className="bg-white border border-gray-300 rounded-lg p-4 h-32 text-center cursor-pointer hover:border-green-500">
                  {index === 0 ? (
                    <img
                      src={"https://ssl.gstatic.com/docs/templates/thumbnails/sheets-blank-googlecolors.png"}
                      alt={template.name}
                      className="w-36 mx-auto mb-2"
                    />
                  ) : (
                    <div className="text-4xl mb-2">{template.content}</div>
                  )}
                </div>
                <div className="text-sm pl-2">{template.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className='px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 bg-white py-4 min-h-[calc(100vh-theme(spacing.32))]'>
          <div className="flex justify-between items-center mb-4">
            <span className="text-base font-medium">Previous 7 days</span>
          </div>

          <div className="flex flex-col gap-3">
            {recentFiles.map((file, index) => (
              <div key={index} className="flex items-center bg-white rounded py-1">
                <div className="mr-4 text-2xl">
                  <img
                    src={"https://storage.googleapis.com/support-forums-api/attachment/thread-283161894-15164797576821732912.png"}
                    alt={"doc icon"}
                    className="w-6 mx-auto mb-2"
                  />
                </div>
                <div className="flex-1">
                  <span className="block font-medium text-sm">{file.name}</span>
                </div>
                <button className="text-gray-500"><FaEllipsisV /></button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
