'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStore } from '@/store/useFormStore';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';
import { IconDotsVertical, IconRename, IconDuplicate, IconTrash, IconPublish, IconUnpublish, IconIntegrations } from '@/components/icons';
import { QUESTION_TYPE_META } from '@/lib/utils';
import type { Form } from '@/types';
import { cn, formatDate } from '@/lib/utils';

interface FormListItemProps {
  form: Form;
  onRename: (form: Form) => void;
}

export function FormListItem({ form, onRename }: FormListItemProps) {
  const router = useRouter();
  const { deleteForm, duplicateForm, publishForm, unpublishForm, setActiveFormId } = useFormStore();
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenBuilder = () => {
    setActiveFormId(form.id);
    router.push(`/forms/${form.id}`);
  };

  const handleDuplicate = () => {
    duplicateForm(form.id);
  };

  const handleDelete = () => {
    if (confirm(`Delete "${form.title}"? This cannot be undone.`)) {
      deleteForm(form.id);
    }
  };

  const handleTogglePublish = () => {
    if (form.status === 'published') {
      unpublishForm(form.id);
    } else {
      publishForm(form.id);
    }
  };

  // Build a mini preview of question types in the thumbnail
  const firstFewTypes = form.questions.slice(0, 3).map((q) => q.type);

  return (
    <div
      className={cn(
        'flex items-center h-14 border-b border-[#f0eeef] cursor-pointer',
        'transition-colors duration-75 group',
        isHovered ? 'bg-[#fafafa]' : 'bg-white'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOpenBuilder}
      id={`form-row-${form.id}`}
    >
      {/* Thumbnail */}
      <div className="pl-5 pr-4 shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: form.thumbnailColor }}
        >
          {/* Mini question type icons — matching the brown square in home.png */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              fill="rgba(255,255,255,0.85)"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v9A1.5 1.5 0 0 1 12.5 14h-9A1.5 1.5 0 0 1 2 12.5v-9zm2.5 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </div>
      </div>

      {/* Form name — takes remaining space before the columns */}
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-medium text-[#3C323E] truncate">{form.title}</p>
        {form.status === 'draft' && (
          <p className="text-xs text-[#847E85]">Draft</p>
        )}
      </div>

      {/* Responses column */}
      <div className="w-28 shrink-0 text-sm text-[#3C323E] text-center">
        {form.responseCount > 0 ? form.responseCount : '–'}
      </div>

      {/* Completed column */}
      <div className="w-28 shrink-0 text-sm text-[#3C323E] text-center">
        {form.completionRate ?? '–'}
      </div>

      {/* Updated column */}
      <div className="w-36 shrink-0 text-sm text-[#655D67]">
        {formatDate(form.updatedAt)}
      </div>

      {/* Integrations column */}
      <div className="w-24 shrink-0 flex items-center justify-center">
        <button
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            isHovered
              ? 'text-[#655D67] hover:bg-[#f0eef1]'
              : 'text-transparent'
          )}
          title="Integrations"
        >
          <IconIntegrations size={16} />
        </button>
      </div>

      {/* 3-dot menu */}
      <div className="w-14 shrink-0 flex items-center justify-center">
        <div
          className={cn(
            'transition-opacity duration-75',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown
            align="right"
            trigger={
              <button
                className="p-1.5 rounded-md text-[#655D67] hover:bg-[#f0eef1] transition-colors"
                title="More options"
                id={`form-menu-${form.id}`}
              >
                <IconDotsVertical size={15} />
              </button>
            }
          >
            <DropdownItem
              icon={<IconRename size={14} strokeWidth={1.5} />}
              onClick={() => onRename(form)}
            >
              Rename
            </DropdownItem>
            <DropdownItem
              icon={<IconDuplicate size={14} strokeWidth={1.5} />}
              onClick={handleDuplicate}
            >
              Duplicate
            </DropdownItem>
            <DropdownItem
              icon={
                form.status === 'published' ? (
                  <IconUnpublish size={14} strokeWidth={1.5} />
                ) : (
                  <IconPublish size={14} strokeWidth={1.5} />
                )
              }
              onClick={handleTogglePublish}
            >
              {form.status === 'published' ? 'Unpublish' : 'Publish'}
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem
              icon={<IconTrash size={14} strokeWidth={1.5} />}
              onClick={handleDelete}
              danger
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

// ─── Column headers row ───────────────────────────────────────────────────────

export function FormListHeader() {
  return (
    <div className="flex items-center h-10 border-b border-[#e4e4e7] bg-white px-0">
      {/* Spacer for thumbnail + name area */}
      <div className="flex-1 pl-[76px] text-xs text-[#847E85] font-medium" />

      {/* Column headers */}
      <div className="w-28 shrink-0 text-xs text-[#847E85] font-medium text-center">
        Responses
      </div>
      <div className="w-28 shrink-0 text-xs text-[#847E85] font-medium text-center">
        Completed
      </div>
      <div className="w-36 shrink-0 text-xs text-[#847E85] font-medium">
        Updated
      </div>
      <div className="w-24 shrink-0 text-xs text-[#847E85] font-medium text-center">
        Integrations
      </div>
      <div className="w-14 shrink-0" />
    </div>
  );
}
