import { db } from '@/lib/database';

export const notesApi = {
  getNotes: async (searchQuery: string) => {
    const query = searchQuery.toLowerCase();
    return db.notes
      .where('title').startsWithIgnoreCase(query)
      .or('content').startsWithIgnoreCase(query)
      .or('tags').anyOf([query])
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
