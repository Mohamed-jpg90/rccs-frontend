"use client";

import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaYoutube, FaGoogleDrive } from "react-icons/fa";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api";
import EntityCard from "@/components/UI/EntityCard";
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";
import ContentFormModal from "@/components/shared/ContentFormModal";

const TYPE_ICONS = {
  YouTube: FaYoutube,
  Drive: FaGoogleDrive,
};

/**
 * ContentManager — lets a Team Leader or Admin add/edit/delete content.
 * Content is now always a Google Drive or YouTube link (no file uploads).
 *
 * Note: ContentFormModal manages its own club selection (with a "No club"
 * option) rather than taking a clubId prop, so this doesn't scope creation
 * to a specific club — it just lists + manages whatever `content` it's given.
 */
export default function ContentManager({ content: initialContent }) {
  const [content, setContent] = useState(initialContent);
  const [formOpen, setFormOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [deletingContent, setDeletingContent] = useState(null);

  const openCreate = () => { setEditingContent(null); setFormOpen(true); };
  const openEdit = (item) => { setEditingContent(item); setFormOpen(true); };
  const closeForm = () => setFormOpen(false);

  const handleSaved = (savedContent) => {
    setContent((prev) => {
      const exists = prev.some((c) => c._id === savedContent._id);
      return exists ? prev.map((c) => (c._id === savedContent._id ? savedContent : c)) : [...prev, savedContent];
    });
    toast.success(editingContent ? "Content updated" : "Content added");
  };

  const handleDelete = async () => {
    await apiClient.delete(`/content/${deletingContent._id}`);
    setContent((prev) => prev.filter((c) => c._id !== deletingContent._id));
    toast.success("Content deleted");
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Content</h2>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
          <FaPlus className="text-xs" /> Add Content
        </button>
      </div>

      {content.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No content yet — add a YouTube video or a Google Drive link.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => {
            const TypeIcon = TYPE_ICONS[item.type] ?? FaGoogleDrive;
            return (
              <EntityCard
                key={item._id}
                title={item.title}
                description={item.description}
                meta={[{ icon: TypeIcon, text: item.type }]}
                actions={[
                  { icon: FaEdit, onClick: () => openEdit(item), label: "Edit" },
                  { icon: FaTrash, onClick: () => setDeletingContent(item), label: "Delete", variant: "danger" },
                ]}
              />
            );
          })}
        </div>
      )}

      <ContentFormModal
        isOpen={formOpen}
        onClose={closeForm}
        content={editingContent}
        onSaved={handleSaved}
      />

      <ConfirmDeleteDialog
        isOpen={Boolean(deletingContent)}
        onClose={() => setDeletingContent(null)}
        onConfirm={handleDelete}
        itemName={deletingContent?.title}
      />
    </section>
  );
}