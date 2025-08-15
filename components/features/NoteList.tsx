"use client";

import React from 'react';
import { NoteCard } from './NoteCard';
import type { Note } from '@/types';

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onView?: (note: Note) => void;
  emptyState?: React.ReactNode;
}

export function NoteList({ notes, onEdit, onDelete, onView, emptyState }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        {emptyState || (
          <div className="space-y-3">
            <div className="text-4xl">📝</div>
            <h3 className="text-lg font-semibold">No notes found</h3>
            <p className="text-muted-foreground">
              Create your first note to get started with your knowledge management journey.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}
