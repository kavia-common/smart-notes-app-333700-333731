"use client";
import { useEffect, useState } from "react";
import { fetchNotes, createNote, updateNote, deleteNote, fetchFavorites, Note, NoteInput } from "@/utils/api";
import NoteEditor from "@/components/NoteEditor";

export interface Note {
  id?: string;
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
  [key: string]: any; // for extra backend fields
}
export interface NoteInput {
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
  id?: string;
}

interface NotesMainProps {
  token: string;
}

export default function NotesMain({ token }: NotesMainProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Listen for sidebar and header events (tags, search, favorites)
  useEffect(() => {
    // Handler function for search events
    function searchHandler(e: Event) {
      const customEvent = e as CustomEvent<string>;
      const query = customEvent.detail || "";
      setFilteredNotes(notes.filter(n =>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.content.toLowerCase().includes(query.toLowerCase())
      ));
    }
    // Handler function for tag select events
    function tagHandler(e: Event) {
      const customEvent = e as CustomEvent<string>;
      const tag = customEvent.detail;
      setFilteredNotes(notes.filter(n => n.tags?.includes(tag)));
    }
    // Handler function for favorites events (no detail)
    async function favoritesHandler(_: Event) {
      setFilteredNotes(await fetchFavorites(token));
    }
    window.addEventListener("notes-search", searchHandler);
    window.addEventListener("notes-tag-select", tagHandler);
    window.addEventListener("notes-favorites-select", favoritesHandler);
    return () => {
      window.removeEventListener("notes-search", searchHandler);
      window.removeEventListener("notes-tag-select", tagHandler);
      window.removeEventListener("notes-favorites-select", favoritesHandler);
    };
  }, [notes, token]);

  useEffect(() => {
    setLoading(true);
    fetchNotes(token).then(data => {
      setNotes(data);
      setFilteredNotes(data);
      setLoading(false);
    });
  }, [token]);

  // NOTE: Editor handles CRUD, invokes onSave or onDelete
  const handleSave = async (note: NoteInput) => {
    setLoading(true);
    let updated: Note;
    if (note.id) {
      updated = await updateNote(token, note);
    } else {
      updated = await createNote(token, note);
    }
    const nds = await fetchNotes(token);
    setNotes(nds as Note[]);
    setFilteredNotes(nds as Note[]);
    setSelectedNote(updated);
    setLoading(false);
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    await deleteNote(token, id);
    const nds = await fetchNotes(token);
    setNotes(nds as Note[]);
    setFilteredNotes(nds as Note[]);
    setSelectedNote(null);
    setLoading(false);
  };

  return (
    <main className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
      <div className="md:w-1/3 w-full h-[300px] md:h-auto overflow-y-auto border-gray-200 border-r bg-white flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="text-[#3b82f6] font-bold text-lg">My Notes</div>
          <button
            className="px-2 py-1 rounded bg-[#06b6d4] text-white text-xs hover:bg-[#3b82f6]"
            onClick={() => setSelectedNote({})}
          >
            + New Note
          </button>
        </div>
        <ul className="overflow-y-auto px-5 flex-1 pb-3">
          {!loading && filteredNotes.length === 0 && (
            <li className="text-gray-400 italic py-3">No notes yet.</li>
          )}
          {filteredNotes.map((n, idx) => (
            <li
              key={n.id || idx}
              className={`mb-2 cursor-pointer p-2 rounded ${
                selectedNote && n.id === selectedNote.id
                  ? "bg-[#dbeafe] border-l-4 border-[#3b82f6]"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedNote(n)}
            >
              <div className="font-semibold text-[#111827] truncate">{n.title || "(untitled)"}</div>
              <div className="text-xs text-[#64748b] truncate mt-1">{n.content?.slice(0, 50)}</div>
              <div className="text-xs text-[#06b6d4] mt-1">{n.tags?.map((t: string) => `#${t} `)}</div>
              <div className="text-xs float-right">
                {n.favorite && <span className="font-bold text-[#3b82f6]">★</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <section className="flex-1 bg-[#f9fafb] h-full overflow-auto">
        <NoteEditor
          note={selectedNote}
          onSave={handleSave}
          onDelete={handleDelete}
          loading={loading}
        />
      </section>
    </main>
  );
}
