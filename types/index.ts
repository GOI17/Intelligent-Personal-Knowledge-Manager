// Core note interface
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export type CreateNoteInput = Omit<
  Note,
  "id" | "createdAt" | "updatedAt" | "userId"
>;

export interface UpdateNoteInput
  extends Partial<Omit<Note, "id" | "createdAt" | "userId">> {
  id: string;
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
