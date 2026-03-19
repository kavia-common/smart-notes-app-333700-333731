"use client";
import { useState, useEffect } from "react";
import type { Note, NoteInput } from "./NotesMain";

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: NoteInput) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onSave, onDelete, loading }: NoteEditorProps) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [favorite, setFavorite] = useState<boolean>(false);

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setTags(note?.tags || []);
    setFavorite(note?.favorite || false);
  }, [note]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  if (note == null) {
    return (
      <div className="flex items-center h-full justify-center text-gray-400">
        Select or create a note to get started.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-7 mt-6 bg-white rounded-xl shadow-md min-h-[85%]">
      <form
        onSubmit={e => {
          e.preventDefault();
          onSave({
            ...note,
            title,
            content,
            tags,
            favorite
          });
        }}
        className="flex flex-col gap-3"
      >
        <input
          type="text"
          placeholder="Title"
          className="text-lg px-2 py-2 font-semibold rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
          required
        />
        <textarea
          rows={7}
          placeholder="Write your note here…"
          className="w-full px-2 py-2 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#06b6d4] resize-vertical"
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={loading}
          required
        />
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag, idx) => (
            <div key={idx} className="bg-[#e0f2fe] text-[#0284c7] rounded px-2 py-1 flex items-center text-xs">
              #{tag}
              <button
                type="button"
                className="ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => handleRemoveTag(idx)}
                aria-label="Remove tag"
              >
                ×
              </button>
            </div>
          ))}
          <input
            type="text"
            value={tagInput}
            placeholder="Add tag"
            className="border border-gray-200 rounded px-2 py-1 w-24 text-xs"
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            disabled={loading}
          />
        </div>
        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-medium border border-[#3b82f6] transition ${
              favorite ? "bg-[#3b82f6] text-white" : "bg-white text-[#3b82f6] hover:bg-[#dbeafe]"
            }`}
            onClick={() => setFavorite(f => !f)}
          >
            {favorite ? "★ Pinned" : "☆ Pin/Favorite"}
          </button>
          <div className="flex-1" />
          {note.id && (
            <button
              type="button"
              className="ml-2 px-4 py-1 rounded text-xs bg-[#ef4444] text-white hover:bg-red-500"
              onClick={() => note.id && onDelete(note.id)}
              disabled={loading}
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            className="ml-2 px-5 py-1 rounded text-xs bg-[#06b6d4] text-white hover:bg-[#3b82f6] font-medium"
            disabled={loading}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
