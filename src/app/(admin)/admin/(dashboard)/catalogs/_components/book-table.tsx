import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import type { Book } from "@/lib/api-client";

function getStockStatus(quantity: number) {
  if (quantity === 0) return { label: "Out of Stock", cls: "bg-red-100 text-red-700" };
  if (quantity <= 10) return { label: "Low Stock", cls: "bg-yellow-100 text-yellow-700" };
  return { label: "In Stock", cls: "bg-green-100 text-green-700" };
}

interface Props {
  books: Book[];
  loading: boolean;
  error: string | null;
  deleting: string | null;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onRetry: () => void;
  hasNext:boolean|false, 
  hasPrev:boolean|false,
   onNext: () => void;
   onPrev:()=>void
}

export default function BookTable({
  books,
  loading,
  error,
  deleting,
  onEdit,
  onDelete,
  onAdd,
  onRetry,
  onNext, 
  onPrev,hasPrev,hasNext
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-3 text-gray-600">Loading books...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
        <button onClick={onRetry} className="ml-4 text-red-800 underline hover:no-underline">
          Retry
        </button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500 mb-4">No books found in the catalog.</p>
        <button onClick={onAdd} className="text-blue-600 hover:text-blue-800">
          Add your first book
        </button>
      </div>
    );
  }

  return (
    <>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {["Book", "Format", "Price", "Stock", "Status", "Actions"].map((h) => (
              <th
                key={h}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {books.map((book) => {
            const status = getStockStatus(book.stockQuantity);
            return (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {book.coverImageUrl && (
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded"
                        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800">{book.title}</p>
                      <p className="text-xs text-gray-500">{book.publisher}</p>
                      <p className="text-xs text-gray-400">ISBN: {book.isbn}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{book.format}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  ${(+book.price).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{book.stockQuantity}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${status.cls}`}>
                    {status.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(book)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => book.id && onDelete(book.id)}
                      disabled={deleting === book.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <FontAwesomeIcon
                        icon={deleting === book.id ? faSpinner : faTrash}
                        className={`w-4 h-4 ${deleting === book.id ? "animate-spin" : ""}`}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

     
    </div>
     <div className="flex items-center justify-between w-full px-1 py-2">
       <button
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors
            ${!hasPrev
              ? "invisible"
              : "text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          disabled={!hasPrev}
          onClick={onPrev}
        >
          ← Previous
        </button>

        <button
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors
            ${!hasNext
              ? "invisible"
              : "text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          disabled={!hasNext}
          onClick={onNext}
        >
          Next →
        </button>
      </div>
      </>
  );
}
