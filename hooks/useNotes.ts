import { useCallback, useMemo } from 'react';
import type { Note, CreateNoteInput, UpdateNoteInput } from '@/types';
import { 
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation
} from '@/services/notes';

export function useNotes() {
  const { data: notes = [], isLoading } = useGetNotesQuery('');
  const [createNoteMutation] = useCreateNoteMutation();
  const [updateNoteMutation] = useUpdateNoteMutation();
  const [deleteNoteMutation] = useDeleteNoteMutation();

  // Create a new note
  const createNote = useCallback(async (input: CreateNoteInput) => {
    const newNote = await createNoteMutation({
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).unwrap();
    return newNote;
  }, [createNoteMutation]);

  // Update an existing note
  const updateNote = useCallback(async (id: string, updates: UpdateNoteInput) => {
    const updatedNote = await updateNoteMutation({
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    }).unwrap();
    return updatedNote;
  }, [updateNoteMutation]);

  // Delete a note
  const deleteNote = useCallback(async (id: string) => {
    await deleteNoteMutation(id).unwrap();
  }, [deleteNoteMutation]);

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
