"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getBooks, deleteBook, type Book, ApiError, BooksResponse } from "@/lib/api-client";
import { useFetch } from "@/hooks/use-fetch";
import PageHeader from "@/components/common/page-header";
import SearchBar from "@/components/common/search-bar";
import { useBookModal } from "./_hooks/use-book-modal";
import BookTable from "./_components/book-table";
import BookFormModal from "./_components/book-form-modal";

export default function CatalogsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: booksResponse, loading, error, refetch: fetchBooks } = useFetch<BooksResponse>(
    () => getBooks(page, limit),
    "Failed to fetch books. Please try again.",
    [page],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const modal = useBookModal(fetchBooks);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    setDeleting(id);
    try {
      await deleteBook(id);
      toast.success("Book deleted successfully!");
      fetchBooks();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete book.");
    } finally {
      setDeleting(null);
    }
  };

  const filteredBooks = (booksResponse?.books ?? []).filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.publisher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Catalogs"
        subtitle="Manage your book inventory"
        actionLabel="Add New Book"
        onAction={modal.openCreate}
      />
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search books by title, publisher, or ISBN..."
      />
      <BookTable
        books={filteredBooks}
        hasPrev={booksResponse?.pagination?.hasPrev ?? false}
        hasNext={booksResponse?.pagination?.hasNext ?? false}
        loading={loading}
        error={error}
        deleting={deleting}
        onEdit={modal.openEdit}
        onDelete={handleDelete}
        onAdd={modal.openCreate}
        onRetry={fetchBooks}
        onNext={() => setPage((p) => p + 1)}
        onPrev={() => setPage((p) => p - 1)}
        
      />
      <BookFormModal modal={modal} />
    </div>
  );
}
