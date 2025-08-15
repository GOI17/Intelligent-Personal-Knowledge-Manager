import { useState, useCallback, useMemo } from 'react';
import type { Note, CreateNoteInput, UpdateNoteInput } from '@/types';

// Generate unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Sample initial data
const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to Knowledge Manager',
    content: 'This is your first note! You can create, edit, and delete notes using this interface. Try creating a new note using the "New Note" button.',
    tags: ['welcome', 'tutorial'],
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '2', 
    title: 'React Hooks Best Practices',
    content: 'Key points about React hooks:\n\n1. Always call hooks at the top level\n2. Use custom hooks to share logic\n3. useCallback and useMemo for performance\n4. useState for local state management',
    tags: ['react', 'hooks', 'javascript'],
    createdAt: new Date(Date.now() - 43200000), // 12 hours ago
    updatedAt: new Date(Date.now() - 21600000), // 6 hours ago
  },
  {
    id: '3',
    title: 'TypeScript Tips',
    content: 'Useful TypeScript patterns for better code:\n\n- Use interfaces for object shapes\n- Prefer type unions over any\n- Leverage utility types like Pick, Omit\n- Use generics for reusable components',
    tags: ['typescript', 'programming', 'tips'],
    createdAt: new Date(Date.now() - 21600000), // 6 hours ago
    updatedAt: new Date(Date.now() - 10800000), // 3 hours ago
  },
];

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  // Create a new note
  const createNote = useCallback((input: CreateNoteInput) => {
    const newNote: Note = {
      id: generateId(),
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, []);

  // Update an existing note
  const updateNote = useCallback((id: string, updates: UpdateNoteInput) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id 
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    );
  }, []);

  // Delete a note
  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  // Get a single note by ID
  const getNote = useCallback((id: string) => {
    return notes.find(note => note.id === id);
  }, [notes]);

  // Get all unique tags with counts
  const allTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    
    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries()).map(([name, count]) => ({
      id: name,
      name,
      count,
    })).sort((a, b) => b.count - a.count);
  }, [notes]);

  // Search notes by title or content
  const searchNotes = useCallback((query: string) => {
    if (!query.trim()) return notes;
    
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [notes]);

  // Filter notes by tag
  const filterByTag = useCallback((tag: string) => {
    return notes.filter(note => note.tags.includes(tag));
  }, [notes]);

  return {
    notes,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    searchNotes,
    filterByTag,
    allTags,
    totalNotes: notes.length,
  };
}
