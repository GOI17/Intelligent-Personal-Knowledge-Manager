import { notesApi } from '../features/notesSlice';

// Export hooks from the inject endpoints API
export const {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
