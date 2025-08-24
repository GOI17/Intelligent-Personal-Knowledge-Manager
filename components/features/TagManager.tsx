'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Tag } from '@/types';

interface TagManagerProps {
  tags: Tag[];
  onTagCreate: (name: string) => void;
  onTagDelete: (id: string) => void;
  onTagUpdate: (id: string, newName: string) => void;
}

export function TagManager({ 
  tags, 
  onTagCreate, 
  onTagDelete, 
  onTagUpdate 
}: TagManagerProps) {
  const [newTagName, setNewTagName] = useState('');

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagName.trim()) {
      onTagCreate(newTagName.trim());
      setNewTagName('');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleCreateTag} className="flex gap-2">
        <Input
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New tag name"
        />
        <Button type="submit">Create Tag</Button>
      </form>

      <div className="space-y-2">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center gap-2">
            <Input
              value={tag.name}
              onChange={(e) => onTagUpdate(tag.id, e.target.value)}
              className="w-auto"
            />
            <Button
              variant="destructive"
              onClick={() => onTagDelete(tag.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
