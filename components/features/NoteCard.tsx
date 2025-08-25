"use client";

import React from 'react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';
import type { Note } from '@/types';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onView?: (note: Note) => void;
}

export function NoteCard({ note, onEdit, onDelete, onView }: NoteCardProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow cursor-pointer">
      <div onClick={() => onView?.(note)}>
        <CardHeader>
          <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
          <CardDescription>
            Created {formatDate(note.createdAt)}
            {new Date(note.updatedAt).getTime() !== new Date(note.createdAt).getTime() && 
              ` • Updated ${formatDate(note.updatedAt)}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
            {truncateContent(note.content)}
          </p>
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </div>
      <CardFooter className="flex gap-2 pt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(note);
          }}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onView?.(note);
          }}
        >
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note);
          }}
          className="text-destructive hover:text-destructive"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
