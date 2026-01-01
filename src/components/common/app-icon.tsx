import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type AppIconProps = {
  icon: IconProp;
  className?: string;
  color?: string;
  href?: string;
};

const AppIcon = ({ icon, className, color, href }: AppIconProps) => {
  const Icon = (
    <FontAwesomeIcon icon={icon} className={className} style={{ color }} />
  );
  return href ? (
    <a
      href={href ?? ""}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook"
    >
      {Icon}
    </a>
  ) : (
    Icon
  );
};

export default AppIcon;
