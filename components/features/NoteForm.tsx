"use client";

import React, { useState } from 'react';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';
import { TagManager } from '@/components/features/TagManager';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Note, CreateNoteInput, UpdateNoteInput } from '@/types';

interface NoteFormProps {
  note?: Note; // For editing existing notes
  onSubmit: (data: CreateNoteInput | UpdateNoteInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function NoteForm({ note, onSubmit, onCancel, isLoading = false }: NoteFormProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: note?.content || '',
    onUpdate: ({ editor }) => {
      setFormData(prev => ({
        ...prev,
        content: editor.getHTML()
      }));
    },
  });

  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    tags: note?.tags || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const noteData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags: formData.tags,
    };

    onSubmit(noteData);
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{note ? 'Edit Note' : 'Create New Note'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleInputChange('title')}
              placeholder="Enter note title..."
              className={errors.title ? 'border-destructive' : ''}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <div className={`rounded-md border p-2 ${errors.content ? 'border-destructive' : 'border-input'}`}>
              <EditorContent 
                editor={editor} 
                className="min-h-[200px] p-2 focus:outline-none" 
              />
            </div>
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagManager
              tags={formData.tags}
              onTagCreate={async (name) => {
                const newTag = await createTag({ 
                  name,
                  color: '#808080',
                  createdAt: new Date(),
                  updatedAt: new Date()
                });
                setFormData(prev => ({
                  ...prev,
                  tags: [...prev.tags, newTag.id]
                }));
              }}
              onTagDelete={async (tagId) => {
                await deleteTag(tagId);
                setFormData(prev => ({
                  ...prev,
                  tags: prev.tags.filter(id => id !== tagId)
                }));
              }}
              onTagUpdate={async (tagId, newName) => {
                await updateTag(tagId, { name: newName });
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Saving...' : (note ? 'Update Note' : 'Create Note')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
