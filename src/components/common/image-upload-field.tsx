import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

interface ImageUploadFieldProps {
  preview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  uploading?: boolean;
  label?: string;
}

export default function ImageUploadField({
  preview,
  onFileChange,
  onRemove,
  uploading,
  label = "Image *",
}: ImageUploadFieldProps) {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-start gap-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-24 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <FontAwesomeIcon icon={faCloudUploadAlt} className="w-8 h-8 text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Upload</span>
            <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          </label>
        )}
        <div className="flex-1">
          <p className="text-sm text-gray-500">Upload an image.</p>
          <p className="text-xs text-gray-400 mt-1">Supported: JPG, PNG, WebP</p>
          {uploading && (
            <div className="flex items-center gap-2 mt-2 text-blue-600">
              <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
