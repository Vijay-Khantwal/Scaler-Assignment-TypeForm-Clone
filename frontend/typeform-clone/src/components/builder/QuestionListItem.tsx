'use client';

import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Question } from '@/types';
import { QUESTION_TYPE_META, getLetterIndex } from '@/lib/utils';
import { IconDotsVertical, IconTrash, IconDuplicate, IconChevronUp, IconChevronDown } from '@/components/icons';
import { cn } from '@/lib/utils';

interface QuestionListItemProps {
  question: Question;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  isOverlay?: boolean;
  badgeText?: string;
}

export function QuestionListItem({
  question,
  isSelected,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  isOverlay = false,
  badgeText,
}: QuestionListItemProps & { onMoveUp?: () => void; onMoveDown?: () => void; onDuplicate?: () => void; }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const meta = QUESTION_TYPE_META[question.type];

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({ 
    id: question.id,
    data: { question }
  });

  const style = {
    // Only overlay uses transform from context usually, but for standard draggable we don't apply inline transform here, DragOverlay handles it
  };

  const letter = getLetterIndex(question.index);
  const displayTitle = question.title.trim() || meta.label;

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
      className={cn(
        'group flex items-center gap-2 px-2 py-2 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-75 relative',
        isSelected || isOverlay
          ? 'bg-[#eeecef]'
          : 'hover:bg-[#eeecef]',
        isDragging && !isOverlay && 'opacity-0',
        isOverlay && 'opacity-100 shadow-xl cursor-grabbing'
      )}
      onClick={onSelect}
      id={`question-item-${question.id}`}
    >
      {/* Combined Icon + Number/Letter pill */}
      <div
        className="flex items-center gap-1.5 h-7 px-2 rounded-lg shrink-0 ml-1"
        style={{ backgroundColor: meta.badgeBgHex }}
      >
        <img
          src={meta.iconPath}
          alt={meta.label}
          width={14}
          height={14}
          className="shrink-0 opacity-80"
        />
        <span className="text-[11px] font-bold text-[#3C323E] uppercase tracking-wide">
          {badgeText || (question.parentId ? letter : (question.index + 1))}
        </span>
      </div>

      {/* Question title */}
      <span
        className={cn(
          'flex-1 text-sm truncate',
          question.title.trim()
            ? 'text-[#3C323E]'
            : 'text-[#847E85] italic'
        )}
      >
        {displayTitle}
      </span>

      {/* Required asterisk */}
      {question.settings.required && (
        <span className="text-[#655D67] text-xs shrink-0">*</span>
      )}

      {/* 3-dot menu — shown on hover */}
      <div
        className={cn(
          'shrink-0 transition-opacity duration-75',
          menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
        onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when interacting with menu
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1 rounded-md text-[#847E85] hover:text-[#3C323E] hover:bg-[#f0eef1] transition-colors"
            aria-label="Question options"
          >
            <IconDotsVertical size={14} />
          </button>

          {menuOpen && (
            <div
              className="absolute left-0 top-full mt-1 z-50 bg-white border border-[#e4e4e7] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] py-1.5 w-[160px]"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={(e) => { e.stopPropagation(); onMoveUp?.(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-[#655D67] hover:bg-[#f7f5f8] transition-colors"
              >
                <IconChevronUp size={14} />
                Move up
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onMoveDown?.(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-[#655D67] hover:bg-[#f7f5f8] transition-colors"
              >
                <IconChevronDown size={14} />
                Move down
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDuplicate?.(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-[#655D67] hover:bg-[#f7f5f8] transition-colors"
              >
                <IconDuplicate size={14} />
                Duplicate
              </button>
              <div className="h-px bg-[#e4e4e7] my-1.5 mx-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-[#933b28] hover:bg-[#fdf2ef] transition-colors"
              >
                <IconTrash size={14} strokeWidth={1.5} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
