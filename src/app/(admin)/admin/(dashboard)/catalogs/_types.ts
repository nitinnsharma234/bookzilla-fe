import type { TagOption } from "@/components/common/tag-search-input";

export type BookFormat = "HARDCOVER" | "PAPERBACK" | "EBOOK" | "AUDIOBOOK";

export type ModalState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "edit"; bookId: string };

export interface BookFormData {
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
  authors?: TagOption[];
}

export const initialFormData: BookFormData = {
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
