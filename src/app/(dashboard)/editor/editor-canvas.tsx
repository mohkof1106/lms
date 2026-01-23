'use client';

interface EditorCanvasProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  onMarkClick: (commentId: string) => void;
}

export function EditorCanvas({ editorRef, onMarkClick }: EditorCanvasProps) {
  function handleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    const mark = target.closest('mark[data-comment-id]') as HTMLElement | null;
    if (mark) {
      const commentId = mark.dataset.commentId;
      if (commentId) onMarkClick(commentId);
    }
  }

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onClick={handleClick}
      className="min-h-[600px] flex-1 bg-white dark:bg-zinc-900 p-8 text-base leading-relaxed outline-none border border-border rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20"
      style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
      data-placeholder="Start typing your document..."
    />
  );
}
