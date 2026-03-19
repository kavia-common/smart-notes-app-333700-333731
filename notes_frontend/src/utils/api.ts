const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || "https://vscode-internal-14647-beta.beta01.cloud.kavia.ai:3001";

// Fetch helpers for REST endpoints

// Types for API data
export interface Note {
  id?: string;
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
}
export interface NoteInput {
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
  id?: string;
}

// PUBLIC_INTERFACE
export async function login(email: string, password: string): Promise<string> {
  // Returns JWT token if login successful
  const resp = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!resp.ok) throw new Error("Invalid login credentials");
  const data = await resp.json();
  return data.token; // JWT
}

// PUBLIC_INTERFACE
export async function signup(email: string, password: string): Promise<string> {
  const resp = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!resp.ok) throw new Error("Could not create account");
  const data = await resp.json();
  return data.token; // JWT
}

// PUBLIC_INTERFACE
export async function fetchNotes(token: string): Promise<Note[]> {
  const resp = await fetch(`${BACKEND_URL}/notes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!resp.ok) throw new Error("Failed to fetch notes");
  return resp.json();
}

// PUBLIC_INTERFACE
export async function createNote(token: string, note: NoteInput): Promise<Note> {
  const resp = await fetch(`${BACKEND_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(note),
  });
  if (!resp.ok) throw new Error("Failed to create note");
  return resp.json();
}

// PUBLIC_INTERFACE
export async function updateNote(token: string, note: NoteInput): Promise<Note> {
  const resp = await fetch(`${BACKEND_URL}/notes/${note.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(note),
  });
  if (!resp.ok) throw new Error("Failed to update note");
  return resp.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(token: string, noteId: string): Promise<void> {
  const resp = await fetch(`${BACKEND_URL}/notes/${noteId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!resp.ok) throw new Error("Failed to delete note");
  return;
}

// PUBLIC_INTERFACE
export async function fetchTags(token: string): Promise<string[]> {
  const resp = await fetch(`${BACKEND_URL}/tags`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!resp.ok) return [];
  const data = await resp.json();
  return Array.isArray(data) ? data : [];
}

// PUBLIC_INTERFACE
export async function fetchFavorites(token: string): Promise<Note[]> {
  const resp = await fetch(`${BACKEND_URL}/favorites`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!resp.ok) return [];
  return resp.json();
}
