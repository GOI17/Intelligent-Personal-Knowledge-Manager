import Dexie from 'dexie';

export interface DBNote {
  id: string;
  title: string;
  content: string;
  tagIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DBTag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBUser {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
}

export class NotesDatabase extends Dexie {
  notes!: Dexie.Table<DBNote, string>;
  tags!: Dexie.Table<DBTag, string>;
  users!: Dexie.Table<DBUser, string>;
  noteTags!: Dexie.Table<{ noteId: string; tagId: string }, [string, string]>;

  constructor() {
    super('NotesDatabase');
    this.version(3).stores({
      notes: 'id, title, createdAt',
      tags: 'id, name, createdAt',
      users: 'id, email, createdAt',
      noteTags: '[noteId+tagId], noteId, tagId'
    });
  }
}

export const db = new NotesDatabase();
