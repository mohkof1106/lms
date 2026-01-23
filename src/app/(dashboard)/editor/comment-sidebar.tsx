'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { EditorComment } from './types';

interface CommentSidebarProps {
  comments: EditorComment[];
  activeCommentId: string | null;
  onCommentClick: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export function CommentSidebar({
  comments,
  activeCommentId,
  onCommentClick,
  onDeleteComment,
}: CommentSidebarProps) {
  if (comments.length === 0) {
    return (
      <div className="w-72 border-l border-border p-4">
        <p className="text-sm text-muted-foreground">
          Select text and click &ldquo;Comment&rdquo; to add annotations.
        </p>
      </div>
    );
  }

  return (
    <div className="w-72 border-l border-border overflow-y-auto">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-medium">{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h3>
      </div>
      <div className="flex flex-col gap-2 p-2">
        {comments.map((comment) => (
          <div
            key={comment.id}
            onClick={() => onCommentClick(comment.id)}
            className={`cursor-pointer rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50 ${
              activeCommentId === comment.id
                ? 'border-primary bg-primary/5'
                : 'border-border'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs text-muted-foreground italic line-clamp-1">
                &ldquo;{comment.highlightedText}&rdquo;
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteComment(comment.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="mt-1.5 text-sm">{comment.text}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {comment.author} &middot; {formatTime(comment.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
