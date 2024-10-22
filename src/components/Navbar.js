"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 shadow-md text-white flex justify-between items-center h-20 fixed top-0 w-full z-50">
      <div className="flex items-center w-full">
        <div className="flex items-center space-x-4">
          <Image
            src="/images/logo/leads_poppins.png"
            alt="LeADS Logo"
            width={300}
            height={40}
            className="h-13"
          />
          <div className="border-l border-gray-200 h-10 mx-4"></div>
        </div>
        <div className="flex-1 flex ml-8 space-x-8 text-xl">
          <button className="text-white">Home</button>
          <button className="text-white">Faculty</button>
          <button className="text-white">Announcements</button>
          <button className="text-white">Helpdesk</button>

          {/* Dropdown Bahasa */}
          <div className="relative">
            <button
              className="text-white flex items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              English (EN) <span className="ml-1">▼</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">
                    English (EN)
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">
                    Indonesian (ID)
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Avatar and Icons */}
        <div className="flex items-center justify-end space-x-4">
          <div className="bg-white p-2 rounded-full cursor-pointer hover:bg-gray-200">
            <Image
              src="/svg/Visibility.svg"
              alt="Visibility Icon"
              width={24}
              height={24}
            />
          </div>
          <div className="bg-white p-2 rounded-full relative cursor-pointer hover:bg-gray-200">
            <Image
              src="/svg/bell.svg"
              alt="Notification Icon"
              width={24}
              height={24}
            />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
              377
            </span>
          </div>
          <div className="bg-white p-2 rounded-full cursor-pointer hover:bg-gray-200">
            <Image src="/svg/chat.svg" alt="Chat Icon" width={24} height={24} />
          </div>
          <div className="bg-white p-2 rounded-full cursor-pointer hover:bg-gray-200">
            <Image
              src="/svg/settings.svg"
              alt="Settings Icon"
              width={24}
              height={24}
            />
          </div>
          <div className="relative ml-4">
            <Image
              src="/profile.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
              377
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;