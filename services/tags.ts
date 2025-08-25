import { db } from '@/lib/database';

export const createTag = async (tag: Omit<DBTag, 'id'>) => {
  const id = crypto.randomUUID();
  await db.tags.add({ ...tag, id });
  return { ...tag, id };
};

export const updateTag = async (id: string, updates: Partial<DBTag>) => {
  await db.tags.update(id, { ...updates, updatedAt: new Date() });
  return db.tags.get(id);
};

export const deleteTag = async (id: string) => {
  await db.tags.delete(id);
  await db.noteTags.where('tagId').equals(id).delete();
};

export const getTags = async () => {
  return db.tags.toArray();
};
