"use client";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Home() {
  const handleCreateNewSpreadsheet = () => {
    const uniqueId = Date.now().toString();
    router.push(`/spreadsheets/${uniqueId}`);
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center p-2 px-4 bg-white border-b border-gray-300">
        <div className="flex items-center gap-4">
          <button className="text-2xl bg-transparent border-none cursor-pointer text-gray-900">
            <RxHamburgerMenu />
          </button>
          <div className="flex items-center gap-2 text-gray-900">
            <img
              src="https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png"
              alt="Sheets"
              className="h-10 w-10"
            />
            <span className="text-xl pt-2">Sheets</span>
          </div>
        </div>

        <div className="flex-1 max-w-3xl mx-auto relative text-gray-900">
          <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full  py-3 px-14 rounded-full border-none bg-gray-100 outline-none active:shadow-sm placeholder:text-gray-900"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s"
              alt="Profile"
              className="w-full h-full"
            />
          </div>
        </div>
      </header>

      <main className="pt-6 w-full h-fit text-gray-600 font-medium">
        <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base font-medium pl-1">
              Start a new spreadsheet
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            <div className="flex-col  flex gap-y-2">
              <div
                onClick={() => handleCreateNewSpreadsheet()}
                className="bg-white border border-gray-300 rounded-lg p-4 h-32 text-center cursor-pointer hover:border-green-500"
              >
                <img
                  src={
                    "https://ssl.gstatic.com/docs/templates/thumbnails/sheets-blank-googlecolors.png"
                  }
                  alt={"starter image"}
                  className="w-36 mx-auto mb-2"
                />
              </div>
              <div className="text-sm pl-2">{"Blank spreadsheet"}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
