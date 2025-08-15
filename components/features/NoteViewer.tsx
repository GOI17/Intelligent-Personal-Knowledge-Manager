"use client";

import React from 'react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';
import type { Note } from '@/types';

interface NoteViewerProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onClose: () => void;
}

export function NoteViewer({ note, onEdit, onDelete, onClose }: NoteViewerProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{note.title}</CardTitle>
            <CardDescription>
              <div className="space-y-1">
                <div>Created: {formatDate(note.createdAt)}</div>
                {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                  <div>Last updated: {formatDate(note.updatedAt)}</div>
                )}
              </div>
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <div className="text-foreground whitespace-pre-line leading-relaxed">
            {note.content}
          </div>
        </div>
        
        {note.tags.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button 
          onClick={() => onEdit(note)}
          className="flex-1"
        >
          Edit Note
        </Button>
        <Button 
          variant="outline"
          onClick={onClose}
        >
          Close
        </Button>
        <Button 
          variant="destructive"
          onClick={() => onDelete(note)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
