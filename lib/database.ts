import Dexie from 'dexie';

export interface DBNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class NotesDatabase extends Dexie {
  notes!: Dexie.Table<DBNote, string>;

  constructor() {
    super('NotesDatabase');
    this.version(1).stores({
      notes: 'id, title, tags, createdAt'
    });
  }
}

export const db = new NotesDatabase();
