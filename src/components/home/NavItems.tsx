import AppIcon from "../common/app-icon";
import { AppIconProps } from "@/types/index";

const NavItem = ({ icon, className, color, href, label }: AppIconProps) => (
  <div className="flex gap-2 items-center cursor-wait">
    <AppIcon icon={icon} className="text-[16px] text-3c3b39" />
    <h6 className="text-8e8e8c">{label}</h6>
  </div>
);

export default NavItem;
