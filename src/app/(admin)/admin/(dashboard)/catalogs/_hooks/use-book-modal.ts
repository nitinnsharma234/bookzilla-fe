import { useState } from "react";
import { toast } from "sonner";
import {
  createBook,
  updateBook,
  uploadMedia,
  getAuthors,
  type Book,
  ApiError,
} from "@/lib/api-client";
import type { TagOption } from "@/components/common/tag-search-input";
import { type ModalState, type BookFormData, initialFormData } from "../_types";

export function useBookModal(onSuccess: () => void) {
  const [state, setState] = useState<ModalState>({ open: false });
  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [selectedAuthors, setSelectedAuthors] = useState<TagOption[]>([]);
  const [authorOptions, setAuthorOptions] = useState<TagOption[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const reset = () => {
    setFormData(initialFormData);
    setSelectedAuthors([]);
    setCoverFile(null);
    setCoverPreview(null);
  };

  const close = () => {
    setState({ open: false });
    reset();
  };

  const openCreate = () => {
    reset();
    setState({ open: true, mode: "create" });
  };

  const openEdit = (book: Book) => {
    const authors = book.authors?.map((a) => ({ id: a.id, label: a.name })) ?? [];
    setFormData({
      title: book.title,
      isbn: book.isbn,
      description: book.description,
      format: book.format,
      price: book.price.toString(),
      coverImageUrl: book.coverImageUrl,
      publisher: book.publisher,
      pageCount: book.pageCount.toString(),
      language: book.language,
      stockQuantity: book.stockQuantity.toString(),
      authors,
    });
    setSelectedAuthors(authors);
    setCoverFile(null);
    setCoverPreview(book.coverImageUrl ?? null);
    setState({ open: true, mode: "edit", bookId: book.id! });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setFormData((prev) => ({ ...prev, coverImageUrl: "" }));
  };

  const searchAuthors = async (val: string) => {
    const authors = await getAuthors({ query: val });
    setAuthorOptions(authors.map((a) => ({ id: a.id ?? "", label: a.name })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.open) return;
    setSubmitting(true);
    try {
      let coverImageUrl = formData.coverImageUrl;
      if (coverFile) {
        setUploading(true);
        try {
          coverImageUrl = await uploadMedia(coverFile);
          toast.success("Image uploaded successfully!");
        } catch (err) {
          toast.error(
            err instanceof ApiError ? `Upload failed: ${err.message}` : "Failed to upload image.",
          );
          return;
        } finally {
          setUploading(false);
        }
      }
      if (!coverImageUrl) {
        toast.error("Please upload a cover image");
        return;
      }
      const payload = {
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
        authorIds: selectedAuthors.map((a) => a.id),
      };
      if (state.mode === "edit") {
        await updateBook(state.bookId, payload);
        toast.success("Book updated successfully!");
      } else {
        await createBook(payload);
        toast.success("Book added successfully!");
      }
      close();
      onSuccess();
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : state.mode === "edit"
            ? "Failed to update book."
            : "Failed to add book.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    state,
    openCreate,
    openEdit,
    close,
    formData,
    handleInputChange,
    selectedAuthors,
    setSelectedAuthors,
    authorOptions,
    searchAuthors,
    coverPreview,
    handleFileChange,
    handleRemoveImage,
    uploading,
    submitting,
    handleSubmit,
  };
}
