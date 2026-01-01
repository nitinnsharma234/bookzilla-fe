"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NavlinkProps } from "@/types";

export function NavLink({ href, children }: NavlinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        "transition-colors",
        isActive
          ? "text-7b6b38 font-semibold text-[16px]"
          : "text-111111 hover:text-black text-[14px]"
      )}
    >
      <h6>{children}</h6>
    </Link>
  );
}
