"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faSearch,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import {
  getBooks,
  createBook,
  deleteBook,
  uploadMedia,
  type Book,
  ApiError,
} from "@/lib/api-client";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

type BookFormat = "HARDCOVER" | "PAPERBACK" | "EBOOK" | "AUDIOBOOK";

interface BookFormData {
  title: string;
  description: string;
  format: BookFormat;
  price: string;
  coverImageUrl: string;
  isbn: string;
  publisher: string;
  pageCount: string;
  language: string;
  stockQuantity: string;
}

const initialFormData: BookFormData = {
  title: "",
  description: "",
  format: "HARDCOVER",
  price: "",
  coverImageUrl: "",
  isbn: "",
  publisher: "",
  pageCount: "",
  language: "en",
  stockQuantity: "",
};

export default function CatalogsPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to fetch books. Please try again.");
      }
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setFormData((prev) => ({ ...prev, coverImageUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let coverImageUrl = formData.coverImageUrl;

      // Upload image first if a file was selected
      if (coverFile) {
        setUploading(true);
        try {
          coverImageUrl = await uploadMedia(coverFile);
          toast.success("Image uploaded successfully!");
        } catch (uploadErr) {
          if (uploadErr instanceof ApiError) {
            toast.error(`Image upload failed: ${uploadErr.message}`);
          } else {
            toast.error("Failed to upload image. Please try again.");
          }
          setSubmitting(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      if (!coverImageUrl) {
        toast.error("Please upload a cover image");
        setSubmitting(false);
        return;
      }

      const bookData = {
        title: formData.title,
        description: formData.description,
        format: formData.format,
        price: formData.price,
        coverImageUrl,
        isbn: formData.isbn,
        publisher: formData.publisher,
        pageCount: parseInt(formData.pageCount, 10),
        language: formData.language,
        stockQuantity: parseInt(formData.stockQuantity, 10),
      };

      await createBook(bookData);
      toast.success("Book added successfully!");
      setShowAddModal(false);
      setFormData(initialFormData);
      setCoverFile(null);
      setCoverPreview(null);
      fetchBooks();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to add book. Please try again.");
      }
      console.error("Error adding book:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    setDeleting(id);
    try {
      await deleteBook(id);
      toast.success("Book deleted successfully!");
      fetchBooks();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to delete book. Please try again.");
      }
      console.error("Error deleting book:", err);
    } finally {
      setDeleting(null);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.publisher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (quantity: number) => {
    if (quantity === 0)
      return { label: "Out of Stock", className: "bg-red-100 text-red-700" };
    if (quantity <= 10)
      return { label: "Low Stock", className: "bg-yellow-100 text-yellow-700" };
    return { label: "In Stock", className: "bg-green-100 text-green-700" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Catalogs</h1>
          <p className="text-gray-500 mt-1">Manage your book inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Add New Book
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search books by title, publisher, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-111111"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
          <button
            onClick={fetchBooks}
            className="ml-4 text-red-800 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <FontAwesomeIcon
            icon={faSpinner}
            className="w-8 h-8 text-blue-600 animate-spin"
          />
          <span className="ml-3 text-gray-600">Loading books...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && books.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No books found in the catalog.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            Add your first book
          </button>
        </div>
      )}

      {/* Books Table */}
      {!loading && !error && books.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBooks.map((book) => {
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
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {book.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {book.publisher}
                          </p>
                          <p className="text-xs text-gray-400">
                            ISBN: {book.isbn}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {book.format}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      ${(+book.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {book.stockQuantity}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => book.id && handleDelete(book.id)}
                          disabled={deleting === book.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === book.id ? (
                            <FontAwesomeIcon
                              icon={faSpinner}
                              className="w-4 h-4 animate-spin"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="w-4 h-4"
                            />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Add New Book</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  className="w-5 h-5 text-gray-500"
                />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-111111"
                    placeholder="Enter book title"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-111111"
                    placeholder="Enter book description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format *
                  </label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-111111"
                  >
                    <option value="HARDCOVER">Hardcover</option>
                    <option value="PAPERBACK">Paperback</option>
                    <option value="EBOOK">E-Book</option>
                    <option value="AUDIOBOOK">Audiobook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-111111"
                    placeholder="29.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN *
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-111111"
                    placeholder="0-7432-7356-9"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publisher *
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-111111"
                    placeholder="Publisher name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Count *
                  </label>
                  <input
                    type="number"
                    name="pageCount"
                    value={formData.pageCount}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-111111"
                    placeholder="180"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language *
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-111111"
                    placeholder="en"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-111111"
                    placeholder="100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image *
                  </label>
                  <div className="flex items-start gap-4">
                    {coverPreview ? (
                      <div className="relative">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-24 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-24 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <FontAwesomeIcon
                          icon={faCloudUploadAlt}
                          className="w-8 h-8 text-gray-400"
                        />
                        <span className="text-xs text-gray-500 mt-1">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        Upload a cover image for the book.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Supported formats: JPG, PNG, WebP
                      </p>
                      {uploading && (
                        <div className="flex items-center gap-2 mt-2 text-blue-600">
                          <FontAwesomeIcon
                            icon={faSpinner}
                            className="w-4 h-4 animate-spin"
                          />
                          <span className="text-sm">Uploading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="w-4 h-4 animate-spin"
                      />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                      Add Book
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
