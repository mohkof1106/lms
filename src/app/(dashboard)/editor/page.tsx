'use client';

import { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { EditorToolbar } from './editor-toolbar';
import { EditorCanvas } from './editor-canvas';
import { CommentSidebar } from './comment-sidebar';
import { CommentDialog } from './comment-dialog';
import { exportToDocx } from './export-docx';
import type { EditorComment } from './types';

export default function EditorPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<EditorComment[]>([]);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<{ range: Range; text: string } | null>(null);

  const handleAddComment = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

    const text = selection.toString().trim();
    if (!text) return;

    setPendingSelection({ range: range.cloneRange(), text });
    setDialogOpen(true);
  }, []);

  const handleCommentSubmit = useCallback((commentText: string) => {
    if (!pendingSelection) return;

    const id = crypto.randomUUID();

    // Wrap the selected text with a mark element
    try {
      const mark = document.createElement('mark');
      mark.dataset.commentId = id;
      mark.className = 'bg-yellow-100 dark:bg-yellow-900/30 cursor-pointer rounded-sm';
      pendingSelection.range.surroundContents(mark);
    } catch {
      // surroundContents fails if selection spans elements
      // Fall back gracefully
      alert('Please select text within a single paragraph.');
      return;
    }

    const comment: EditorComment = {
      id,
      text: commentText,
      highlightedText: pendingSelection.text,
      author: 'You',
      createdAt: new Date(),
    };

    setComments((prev) => [...prev, comment]);
    setActiveCommentId(id);
    setPendingSelection(null);
  }, [pendingSelection]);

  const handleMarkClick = useCallback((commentId: string) => {
    setActiveCommentId(commentId);
  }, []);

  const handleCommentClick = useCallback((commentId: string) => {
    setActiveCommentId(commentId);
    const mark = editorRef.current?.querySelector(`mark[data-comment-id="${commentId}"]`);
    mark?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleDeleteComment = useCallback((commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    // Unwrap mark from DOM
    const mark = editorRef.current?.querySelector(`mark[data-comment-id="${commentId}"]`);
    if (mark) {
      const parent = mark.parentNode;
      while (mark.firstChild) {
        parent?.insertBefore(mark.firstChild, mark);
      }
      parent?.removeChild(mark);
    }
    if (activeCommentId === commentId) setActiveCommentId(null);
  }, [activeCommentId]);

  const handleExport = useCallback(async () => {
    if (!editorRef.current) return;
    await exportToDocx(editorRef.current, comments);
  }, [comments]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold">Document Editor</h1>
          <p className="text-xs text-muted-foreground">Edit text, add comments, export to Word</p>
        </div>
        <Button onClick={handleExport} size="sm" className="gap-1.5">
          <Download className="h-4 w-4" />
          Export .docx
        </Button>
      </div>

      {/* Toolbar */}
      <EditorToolbar editorRef={editorRef} onAddComment={handleAddComment} />

      {/* Editor + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <EditorCanvas editorRef={editorRef} onMarkClick={handleMarkClick} />
        </div>
        <CommentSidebar
          comments={comments}
          activeCommentId={activeCommentId}
          onCommentClick={handleCommentClick}
          onDeleteComment={handleDeleteComment}
        />
      </div>

      {/* Comment Dialog */}
      <CommentDialog
        open={dialogOpen}
        selectedText={pendingSelection?.text || ''}
        onClose={() => {
          setDialogOpen(false);
          setPendingSelection(null);
        }}
        onSubmit={handleCommentSubmit}
      />
    </div>
  );
}
