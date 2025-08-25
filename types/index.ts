// Core note interface
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface CreateNoteInput extends Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'> {}
export interface UpdateNoteInput extends Partial<Omit<Note, 'id' | 'createdAt' | 'userId'>> {
  id: string;
}

// Note creation input (without id and timestamps)
export interface CreateNoteInput {
  title: string;
  content: string;
  tags: string[];
}

// Note update input (optional fields)
export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
}

// Tag interface
export interface Tag {
  id: string;
  name: string;
  color?: string;
  count?: number;
}

// User interface (for future use)
export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  createdAt: Date;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}
