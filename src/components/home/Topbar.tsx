import {
  faFacebookF,
  faInstagramSquare,
  faInstagram,
  faLinkedinIn,
  faXTwitter,
  faOpencart,
} from "@fortawesome/free-brands-svg-icons";
import {
  faSearch,
  faUser,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";

import AppIcon from "../common/app-icon";
import NavItem from "@/components/home/NavItems";

const Topbar = () => {
  // F3F2ED
  return (
    <header className="bg-topbar h-12 flex items-center justify-between px-6 sm:px-10 md:px-12 lg:px-20">
      <div className="flex items-center justify-center gap-4">
        <AppIcon
          icon={faFacebookF}
          className="text-[16px] text-grey"
          href="https://www.facebook.com/"
        />
        <AppIcon
          icon={faInstagram}
          className="text-[16px] text-grey"
          href="https://www.instagram.com/"
        />
        <AppIcon
          icon={faLinkedinIn}
          className="text-[16px] text-grey"
          href="https://www.linkedin.com/in/nitin-sharma-7aa2421b7/"
        />
        <AppIcon
          icon={faXTwitter}
          className="text-[16px] text-grey"
          href="https://x.com/"
        />
      </div>
      <div className="flex items-center justify-center gap-4">
        <NavItem icon={faUser} label="Account" />
        <Divider />
        <NavItem icon={faShoppingBag} label="Cart:(0$)" />
        <Divider />
        <NavItem icon={faSearch} label="Search" />
      </div>
    </header>
  );
};

const Divider = () => {
  return <div className=" h-5 bg-e0e0e0 w-[1.5px]"></div>;
};

export default Topbar;
