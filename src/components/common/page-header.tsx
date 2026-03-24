import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
}

export default function PageHeader({ title, subtitle, actionLabel, onAction }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500 mt-1">{subtitle}</p>
      </div>
      <button
        onClick={onAction}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
        {actionLabel}
      </button>
    </div>
  );
}
