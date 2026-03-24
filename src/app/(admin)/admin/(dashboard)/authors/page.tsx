"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import {
  uploadMedia,
  ApiError,
  createAuthor,
  getAuthors,
  AuthorModel,
  deleteAuthor,
} from "@/lib/api-client";
import { useFetch } from "@/hooks/use-fetch";
import { SingleValue } from "react-select";
import CountryDropDown, { CountryOption } from "@/components/common/country-dropdown";
import PageHeader from "@/components/common/page-header";
import SearchBar from "@/components/common/search-bar";
import AdminModal from "@/components/common/admin-modal";
import ImageUploadField from "@/components/common/image-upload-field";

interface AuthorFormData {
  name: string;
  bio: string;
  birthdate: string;
}

const initialFormData: AuthorFormData = { name: "", bio: "", birthdate: "" };

const INPUT_CLS =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800";

export default function AuthorsPage() {
  const { data: authors, loading, error, refetch: fetchAuthors } = useFetch<AuthorModel[]>(
    getAuthors,
    "Failed to fetch authors. Please try again."
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<AuthorFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [nationality, setNationality] = useState<SingleValue<CountryOption>>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let profileUrl = "";
      if (coverFile) {
        setUploading(true);
        try {
          profileUrl = await uploadMedia(coverFile);
          toast.success("Image uploaded successfully!");
        } catch (err) {
          toast.error(err instanceof ApiError ? `Upload failed: ${err.message}` : "Failed to upload image.");
          setSubmitting(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }
      if (!profileUrl) {
        toast.error("Please upload a photo");
        setSubmitting(false);
        return;
      }
      await createAuthor({
        name: formData.name,
        bio: formData.bio,
        profileUrl,
        nationality: nationality?.value ?? "",
        dob: formData.birthdate,
      });
      toast.success("Author added successfully!");
      setShowAddModal(false);
      setFormData(initialFormData);
      setNationality(null);
      setCoverFile(null);
      setCoverPreview(null);
      fetchAuthors();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to add author. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this author?")) return;
    setDeleting(id);
    try {
      await deleteAuthor(id);
      toast.success("Author deleted successfully!");
      fetchAuthors();
    } catch {
      toast.error("Failed to delete author.");
    } finally {
      setDeleting(null);
    }
  };

  const filteredAuthors = (authors ?? []).filter((a) =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Authors"
        subtitle="Manage your authors"
        actionLabel="Add New Author"
        onAction={() => setShowAddModal(true)}
      />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search authors by name..."
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
          <button onClick={fetchAuthors} className="ml-4 text-red-800 underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading authors...</span>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Author", "Bio", "Nationality", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAuthors.map((author) => (
                <tr key={author.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {author.profileUrl && (
                        <img
                          src={author.profileUrl}
                          alt={author.name}
                          className="w-10 h-10 object-cover rounded-full"
                          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{author.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{author.bio}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{author.nationality}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => author.id && handleDelete(author.id)}
                        disabled={deleting === author.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <FontAwesomeIcon
                          icon={deleting === author.id ? faSpinner : faTrash}
                          className={`w-4 h-4 ${deleting === author.id ? "animate-spin" : ""}`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAuthors.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No authors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <AdminModal
          title="Add New Author"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Add Author"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Author&apos;s Name *</label>
            <input
              type="text" name="name" value={formData.name} onChange={handleInputChange}
              required placeholder="Enter author name" className={INPUT_CLS}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio *</label>
            <textarea
              name="bio" value={formData.bio} onChange={handleInputChange}
              required rows={3} placeholder="Enter bio" className={INPUT_CLS}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
            <CountryDropDown value={nationality} onChange={setNationality} />
          </div>

          <ImageUploadField
            label="Author Photo *"
            preview={coverPreview}
            onFileChange={handleFileChange}
            onRemove={handleRemoveImage}
            uploading={uploading}
          />
        </AdminModal>
      )}
    </div>
  );
}
