import AdminModal from "@/components/common/admin-modal";
import ImageUploadField from "@/components/common/image-upload-field";
import TagSearchInput from "@/components/common/tag-search-input";
import type { useBookModal } from "../_hooks/use-book-modal";

const INPUT_CLS =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800";

type BookModalProps = ReturnType<typeof useBookModal>;

interface Props {
  modal: BookModalProps;
}

export default function BookFormModal({ modal }: Props) {
  const {
    state,
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
  } = modal;

  if (!state.open) return null;
  const isEdit = state.mode === "edit";

  return (
    <AdminModal
      title={isEdit ? "Edit Book" : "Add New Book"}
      onClose={close}
      onSubmit={handleSubmit}
      submitting={submitting}
      submitLabel={isEdit ? "Save Changes" : "Add Book"}
    >
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          placeholder="Enter book title"
          className={INPUT_CLS}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={3}
          placeholder="Enter book description"
          className={INPUT_CLS}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Format *</label>
        <select
          name="format"
          value={formData.format}
          onChange={handleInputChange}
          required
          className={INPUT_CLS}
        >
          <option value="HARDCOVER">Hardcover</option>
          <option value="PAPERBACK">Paperback</option>
          <option value="EBOOK">E-Book</option>
          <option value="AUDIOBOOK">Audiobook</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
          min="0"
          step="0.01"
          placeholder="29.99"
          className={INPUT_CLS}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ISBN *</label>
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleInputChange}
          required
          placeholder="0-7432-7356-9"
          className={INPUT_CLS}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Publisher *</label>
        <input
          type="text"
          name="publisher"
          value={formData.publisher}
          onChange={handleInputChange}
          required
          placeholder="Publisher name"
          className={INPUT_CLS}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Page Count *</label>
        <input
          type="number"
          name="pageCount"
          value={formData.pageCount}
          onChange={handleInputChange}
          required
          min="1"
          placeholder="180"
          className={INPUT_CLS}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Language *</label>
        <input
          type="text"
          name="language"
          value={formData.language}
          onChange={handleInputChange}
          required
          placeholder="en"
          className={INPUT_CLS}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
        <input
          type="number"
          name="stockQuantity"
          value={formData.stockQuantity}
          onChange={handleInputChange}
          required
          min="0"
          placeholder="100"
          className={INPUT_CLS}
        />
      </div>

      <TagSearchInput
        label="Authors"
        placeholder="Search and add authors..."
        options={authorOptions}
        selected={selectedAuthors}
        onAdd={(opt) => setSelectedAuthors((prev) => [...prev, opt])}
        onRemove={(id) => setSelectedAuthors((prev) => prev.filter((a) => a.id !== id))}
        onSearch={searchAuthors}
      />

      <ImageUploadField
        label="Cover Image *"
        preview={coverPreview}
        onFileChange={handleFileChange}
        onRemove={handleRemoveImage}
        uploading={uploading}
      />
    </AdminModal>
  );
}
