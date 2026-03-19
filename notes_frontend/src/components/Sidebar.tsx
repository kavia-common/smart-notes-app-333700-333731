"use client";
import { useState, useEffect } from "react";
import { fetchTags, fetchFavorites } from "@/utils/api";

interface SidebarProps {
  token: string;
}

// Could import Note from NotesMain, but duplicating minimal type here to avoid circular dep
interface FavoriteNote {
  id?: string;
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
}

export default function Sidebar({ token }: SidebarProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<FavoriteNote[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Fetch tags/favorites
  useEffect(() => {
    fetchTags(token).then(t => setTags(t));
    fetchFavorites(token).then(setFavorites);
  }, [token]);

  // Emits selection events so NotesMain can filter notes by tag or favorite
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    window.dispatchEvent(new CustomEvent("notes-tag-select", { detail: tag }));
  };
  const handleFavoriteClick = () => {
    setSelectedTag(null);
    window.dispatchEvent(new Event("notes-favorites-select"));
  };

  return (
    <aside className="w-52 bg-white h-full border-r border-gray-200 flex flex-col items-start py-5 pl-7 pr-3 gap-8 min-w-fit sticky top-0">
      <section>
        <div className="mb-2 font-semibold text-[#64748b] text-xs uppercase tracking-widest">Tags</div>
        <ul>
          {tags.map(tag => (
            <li key={tag}>
              <button
                className={`px-2 py-1 rounded text-sm w-full text-left mt-1 ${
                  selectedTag === tag ? "bg-[#dbeafe] text-[#3b82f6]" : "hover:bg-gray-100"
                }`}
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <div className="mb-2 font-semibold text-[#64748b] text-xs uppercase tracking-widest">Favorites</div>
        <button
          className="px-2 py-1 rounded text-sm w-full text-left hover:bg-gray-100"
          onClick={handleFavoriteClick}
        >
          Show favorite notes ({favorites.length})
        </button>
      </section>
    </aside>
  );
}
