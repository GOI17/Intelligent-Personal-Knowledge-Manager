import { db } from '@/lib/database';

export const notesApi = {
  getNotes: async (searchQuery: string) => {
    return db.notes
      .filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .toArray();
  },

  createNote: async (note: DBNote) => {
    await db.notes.add(note);
    return note;
  },

  updateNote: async (id: string, updates: Partial<DBNote>) => {
    await db.notes.update(id, {...updates, updatedAt: new Date()});
    return {...updates, id} as DBNote;
  },

  deleteNote: async (id: string) => {
    await db.notes.delete(id);
  }
};
