import React from "react";
import Link from "next/link";
import DropdownMenu from "../common/dropdown";
import { NavLink } from "../common/navlink";

type Menu = {
  title: string;
  path?: string;
  dropdown?: boolean;
  submenu?: { title: string; path: string }[];
};
const Navbar = () => {
  const menu: Menu[] = [
    { title: "Home", path: "/" },
    { title: "Shop", path: "/shop" },
    {
      title: "Categories",
      path: "#", // or just omit the path
      dropdown: true, // flag to indicate it has a dropdown
      submenu: [
        { title: "Thrillers", path: "/categories/thrillers" },
        { title: "Best Sellers", path: "/categories/best-sellers" },
        { title: "Kidzz", path: "/categories/kidzz" },
      ],
    },
    { title: "Deal of the Day", path: "/deal-of-the-day" },

    { title: "Contact", path: "/contact" },
  ];
  return (
    <>
      <hr className="h-1  bg-color-e5e5e3 w-full" />
      <div className="flex justify-between items-center px-6 sm:px-10 md:px-12 lg:px-20 gap-30 py-0.5">
        <h3 className="text-black">BOOKSAW</h3>

        <div className="flex w-full items-center justify-end">
          {menu.length ? (
            <ul className="hidden  text-sm md:flex md:items-center  gap-4 lg:gap-8 xl:gap-12">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <div key={item.title}>
                    {item.dropdown && item.path ? (
                      // Render dropdown component
                      <DropdownMenu item={item} styleClass="text-111111" />
                    ) : (
                      // Regular link
                      <NavLink href={item.path ?? ""}>{item.title}</NavLink>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Navbar;
