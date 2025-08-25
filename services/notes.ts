import { createApi } from "@reduxjs/toolkit/query/react";
import { db } from "@/lib/database";
import type { Note, CreateNoteInput, UpdateNoteInput } from "@/types";

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: async (arg, api) => ({ data: await arg.queryFn(api) }),
  tagTypes: ["Note"],
  endpoints: (builder) => ({
    getNotes: builder.query<Note[], string>({
      queryFn: async (searchQuery) => ({
        data: await db.notes
          .where("title")
          .startsWithIgnoreCase(searchQuery)
          .or("content")
          .startsWithIgnoreCase(searchQuery)
          .or("tags")
          .anyOf([searchQuery])
          .toArray(),
      }),
      providesTags: ["Note"],
    }),
    createNote: builder.mutation<Note, CreateNoteInput>({
      queryFn: async (newNote) => {
        const noteWithTimestamps = {
          ...newNote,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await db.notes.add(noteWithTimestamps);
        return { data: noteWithTimestamps };
      },
      invalidatesTags: ["Note"],
    }),
    updateNote: builder.mutation<Note, UpdateNoteInput>({
      queryFn: async ({ id, ...updates }) => {
        await db.notes.update(id, { ...updates, updatedAt: new Date() });
        const updatedNote = await db.notes.get(id);
        return { data: updatedNote as Note };
      },
      invalidatesTags: ["Note"],
    }),
    deleteNote: builder.mutation<void, string>({
      queryFn: async (id) => {
        await db.notes.delete(id);
        return { data: undefined };
      },
      invalidatesTags: ["Note"],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
