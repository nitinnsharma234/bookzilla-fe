"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faBook,
  faClockRotateLeft,
  faChartLine,
  faRightFromBracket,
  faCableCar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: faGauge,
  },
  {
    label: "Edit Catalogs",
    href: "/admin/catalogs",
    icon: faBook,
  },
    {
    label: "Edit Categories",
    href: "/admin/categories",
    icon: faCableCar,
  },
    {
    label: "Edit Authors",
    href: "/admin/authors",
    icon: faUser,
  },
  {
    label: "Order History",
    href: "/admin/orders",
    icon: faClockRotateLeft,
  },
  {
    label: "Sales",
    href: "/admin/sales",
    icon: faChartLine,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Bookzilla</h1>
        <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors w-full"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
