"use client";

import React, { useState } from 'react';
import { 
  Layout, 
  Button, 
  Input,
  ConfirmDialog
} from "@/components/ui";
import { useNotes } from '@/hooks/useNotes';
import { NoteForm } from '@/components/features/NoteForm';
import { NoteList } from '@/components/features/NoteList';
import { NoteViewer } from '@/components/features/NoteViewer';
import type { Note, CreateNoteInput, UpdateNoteInput } from '@/types';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

export default function Home() {
  const {
    notes,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    allTags,
    totalNotes,
  } = useNotes();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; note: Note | null }>({
    open: false,
    note: null,
  });

  // Get filtered notes based on search
  const filteredNotes = searchQuery ? searchNotes(searchQuery) : notes;

  const handleCreateNote = () => {
    setViewMode('create');
    setSelectedNote(null);
  };

  const handleEditNote = (note: Note) => {
    setViewMode('edit');
    setSelectedNote(note);
  };

  const handleViewNote = (note: Note) => {
    setViewMode('view');
    setSelectedNote(note);
  };

  const handleDeleteNote = (note: Note) => {
    setDeleteConfirm({ open: true, note });
  };

  const confirmDelete = () => {
    if (deleteConfirm.note) {
      deleteNote(deleteConfirm.note.id);
      setDeleteConfirm({ open: false, note: null });
      if (viewMode === 'view' && selectedNote?.id === deleteConfirm.note.id) {
        setViewMode('list');
        setSelectedNote(null);
      }
    }
  };

  const handleFormSubmit = (data: CreateNoteInput | UpdateNoteInput) => {
    if (viewMode === 'create') {
      // For create mode, we know the data has all required fields
      createNote(data as CreateNoteInput);
    } else if (viewMode === 'edit' && selectedNote) {
      updateNote(selectedNote.id, data);
    }
    setViewMode('list');
    setSelectedNote(null);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedNote(null);
  };

  const handleCloseViewer = () => {
    setViewMode('list');
    setSelectedNote(null);
  };

  const headerContent = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Knowledge Manager</h1>
        {viewMode === 'list' && (
          <div className="text-sm text-muted-foreground">
            {totalNotes} {totalNotes === 1 ? 'note' : 'notes'}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {viewMode === 'list' && (
          <>
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Button size="sm" onClick={handleCreateNote}>
              + New Note
            </Button>
          </>
        )}
        {(viewMode === 'create' || viewMode === 'edit' || viewMode === 'view') && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={viewMode === 'view' ? handleCloseViewer : handleFormCancel}
          >
            ← Back to Notes
          </Button>
        )}
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Navigation</h2>
        <div className="space-y-1">
          <Button 
            variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => {
              setViewMode('list');
              setSelectedNote(null);
              setSearchQuery('');
            }}
          >
            📝 All Notes ({totalNotes})
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            🏷️ Tags ({allTags.length})
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            🔍 Search
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            ⭐ Favorites
          </Button>
        </div>
      </div>
      {allTags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Popular Tags</h3>
          <div className="flex flex-wrap gap-1">
            {allTags.slice(0, 6).map((tag) => (
              <span 
                key={tag.id}
                className="px-2 py-1 text-xs bg-secondary rounded-md cursor-pointer hover:bg-secondary/80"
                onClick={() => setSearchQuery(tag.name)}
              >
                #{tag.name} ({tag.count})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (viewMode) {
      case 'create':
        return (
          <div className="max-w-4xl mx-auto">
            <NoteForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        );
        
      case 'edit':
        return selectedNote ? (
          <div className="max-w-4xl mx-auto">
            <NoteForm
              note={selectedNote}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        ) : null;
        
      case 'view':
        return selectedNote ? (
          <div className="max-w-4xl mx-auto">
            <NoteViewer
              note={selectedNote}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onClose={handleCloseViewer}
            />
          </div>
        ) : null;
        
      case 'list':
      default:
        return (
          <div className="space-y-6">
            {searchQuery && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing results for: &quot;{searchQuery}&quot;</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </Button>
              </div>
            )}
            <NoteList
              notes={filteredNotes}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onView={handleViewNote}
            />
          </div>
        );
    }
  };

  return (
    <>
      <Layout header={headerContent} sidebar={sidebarContent}>
        {renderContent()}
      </Layout>
      
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open, note: null })}
        title="Delete Note"
        description={`Are you sure you want to delete &quot;${deleteConfirm.note?.title}&quot;? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </>
  );
}
