"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

const DropdownMenu = ({ item, styleClass }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={clsx("relative", styleClass)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button>{item.title}</button>

      {isOpen && (
        <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-50">
          {item.submenu?.map((subItem: any) => (
            <Link
              key={subItem.title}
              href={subItem.path}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {subItem.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
