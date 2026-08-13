'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  useDroppable,
  useDraggable,
  closestCorners,
} from '@dnd-kit/core';
import { useFormStore } from '@/store/useFormStore';
import { QuestionListItem } from './QuestionListItem';
import { AddContentModal } from './AddContentModal';
import type { Form, QuestionType, Question } from '@/types';
import { IconPlus, IconDotsVertical, IconDuplicate, IconTrash } from '@/components/icons';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

function PageHeader({ pageIndex, pageId, isOverlay, onDuplicate, onDelete }: { pageIndex: number, pageId: string, isOverlay?: boolean, onDuplicate?: () => void, onDelete?: () => void }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: `page-${pageId}`,
    data: { type: 'page', pageId }
  });

  return (
    <div 
      ref={isOverlay ? undefined : setNodeRef}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
      className={cn(
        "flex items-center justify-between px-1 pt-1 pb-2 cursor-grab active:cursor-grabbing outline-none w-full group/page",
        isDragging && !isOverlay && 'opacity-0 h-0 p-0 m-0 overflow-hidden',
        isOverlay && 'bg-white rounded-xl shadow-xl p-1'
      )}
    >
      <div className="flex items-center gap-1.5 h-7 px-2 rounded-lg bg-[#e4e4e7]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        <span className="text-[11px] font-bold text-[#3C323E] uppercase tracking-wide">
          {pageIndex + 1}
        </span>
      </div>
      {!isOverlay && onDuplicate && onDelete && (
        <div className="opacity-0 group-hover/page:opacity-100 transition-opacity">
          <Dropdown
            align="left"
            trigger={
              <button className="p-1 rounded-md text-[#655D67] hover:bg-[#e4e4e7] transition-colors cursor-pointer" onPointerDown={e => e.stopPropagation()}>
                <IconDotsVertical size={14} />
              </button>
            }
          >
            <DropdownItem icon={<IconDuplicate size={14} />} onClick={onDuplicate}>
              Duplicate
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem icon={<IconTrash size={14} />} onClick={onDelete} danger>
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      )}
    </div>
  );
}

function DropIndicator({ id }: { id: string }) {
  const { isOver, setNodeRef } = useDroppable({ id, data: { type: 'indicator' } });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-1 rounded-full my-0.5 transition-colors duration-150 z-10 relative",
        isOver ? "bg-[#3C323E]" : "bg-transparent"
      )}
    />
  );
}

interface LeftPanelProps {
  form: Form;
}

export function LeftPanel({ form }: LeftPanelProps) {
  const {
    addQuestion,
    deleteQuestion,
    reorderQuestions,
    updateQuestion,
    duplicateQuestion,
    setSelectedQuestionId,
    selectedQuestionId,
    isAddContentModalOpen,
    setAddContentModalOpen,
  } = useFormStore();
  const setTargetParentIdForNewQuestion = (useFormStore.getState() as any).setTargetParentIdForNewQuestion;

  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isUniversalModeOpen, setIsUniversalModeOpen] = useState(false);

  // Require a deliberate drag (not just a click)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const dragId = active.id.toString();
    const qId = dragId.startsWith('page-') ? dragId.replace('page-', '') : dragId;
    const q = form.questions.find((q) => q.id === qId);
    if (q) {
      setActiveQuestion(q);
      setActiveDragId(dragId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveQuestion(null);
    setActiveDragId(null);
    const { active, over } = event;
    if (!over || active.id === over.id || !over.id.toString().startsWith('drop-')) return;

    const dragId = active.id.toString();
    const overId = over.id.toString();
    const isDraggingPage = dragId.startsWith('page-');
    const draggedQId = isDraggingPage ? dragId.replace('page-', '') : dragId;
    
    let questions = [...form.questions];
    const currentIndex = questions.findIndex(q => q.id === draggedQId);
    if (currentIndex === -1) return;
    const currentQ = questions[currentIndex];
    
    // If we are dragging an entire page
    if (isDraggingPage) {
      // We gather the parent and all its children
      const pageQuestions = questions.filter(q => q.id === draggedQId || q.parentId === draggedQId);
      // Remove them from the array temporarily
      questions = questions.filter(q => q.id !== draggedQId && q.parentId !== draggedQId);
      
      let targetIndex = 0;
      if (overId === 'drop-top-page') {
        targetIndex = 0;
      } else if (overId.startsWith('drop-after-page-')) {
        const pageId = overId.replace('drop-after-page-', '');
        const targetPageQuestions = questions.filter(q => q.id === pageId || q.parentId === pageId);
        if (targetPageQuestions.length > 0) {
          const lastTargetQ = targetPageQuestions[targetPageQuestions.length - 1];
          targetIndex = questions.findIndex(q => q.id === lastTargetQ.id) + 1;
        }
      }
      
      // Insert block
      questions.splice(targetIndex, 0, ...pageQuestions);
      reorderQuestions(form.id, questions.map(q => q.id));
      return;
    }
    
    // Otherwise, we are dragging a single section
    const oldParentId = currentQ.parentId;
    let targetIndex = 0;
    let newParentId: string | null = null;
    
    // Track mutations to properly save them
    const parentIdMutations: Record<string, string | null> = {};

    if (overId === 'drop-top-page') {
      targetIndex = 0;
      newParentId = null; // becomes new page at top
    } else if (overId.startsWith('drop-after-page-')) {
      const pageId = overId.replace('drop-after-page-', '');
      const pageQuestions = questions.filter(q => q.id === pageId || q.parentId === pageId);
      const lastQ = pageQuestions[pageQuestions.length - 1];
      targetIndex = questions.findIndex(q => q.id === lastQ.id) + 1;
      newParentId = null; // becomes a new page
    } else if (overId.startsWith('drop-before-child-')) {
      const childId = overId.replace('drop-before-child-', '');
      targetIndex = questions.findIndex(q => q.id === childId);
      const childQ = questions[targetIndex];
      
      if (!childQ?.parentId && childQ) {
        // Dropping BEFORE the page parent. The dropped item becomes the NEW page parent.
        newParentId = null;
        // The old parent becomes a child of the dropped item
        parentIdMutations[childQ.id] = currentQ.id;
        // And all its existing children must also point to the dropped item
        questions.forEach(q => {
          if (q.parentId === childQ.id && q.id !== currentQ.id) {
            parentIdMutations[q.id] = currentQ.id;
          }
        });
      } else {
        newParentId = childQ?.parentId || childQ?.id || null;
      }
    } else if (overId.startsWith('drop-after-child-')) {
      const childId = overId.replace('drop-after-child-', '');
      targetIndex = questions.findIndex(q => q.id === childId) + 1;
      const childQ = questions[targetIndex - 1];
      newParentId = childQ?.parentId || childQ?.id || null;
      if (!childQ?.parentId && childQ) newParentId = childQ.id; // if dropped after parent, it joins the page
    }

    // Adjust targetIndex for array shift
    if (currentIndex < targetIndex) {
      targetIndex--;
    }

    questions.splice(currentIndex, 1);
    parentIdMutations[currentQ.id] = newParentId;
    
    // Parent Promotion: If currentQ was a page parent, its first child must become the new parent!
    if (!oldParentId) {
      const children = questions.filter(q => q.parentId === currentQ.id);
      if (children.length > 0) {
        const newParent = children[0];
        parentIdMutations[newParent.id] = null; // Promote
        for (let i = 1; i < children.length; i++) {
          parentIdMutations[children[i].id] = newParent.id;
        }
        
        // If the dragged parent (currentQ) was dropped into its OWN former page
        // (i.e. newParentId was set to currentQ.id), it must now point to the newly promoted parent.
        if (newParentId === currentQ.id) {
          parentIdMutations[currentQ.id] = newParent.id;
        }
      }
    }

    // Apply mutations safely via store
    Object.entries(parentIdMutations).forEach(([qId, pId]) => {
      updateQuestion(form.id, qId, { parentId: pId });
    });

    questions.splice(targetIndex, 0, currentQ);
    reorderQuestions(form.id, questions.map(q => q.id));
  };

  const handleAddQuestion = (type: QuestionType) => {
    addQuestion(form.id, type);
    setAddContentModalOpen(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    deleteQuestion(form.id, questionId);
  };

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
  };

  return (
    <>
      <aside className="w-[280px] shrink-0 bg-white flex flex-col h-full overflow-hidden px-4 pb-4 gap-3">
        
        {/* Universal mode dropdown */}
        <div className="relative shrink-0 mt-3">
          <button 
            onClick={() => setIsUniversalModeOpen(!isUniversalModeOpen)}
            className="w-full flex items-center justify-between gap-1.5 text-sm text-[#3C323E] bg-[#F7F7F8] rounded-xl px-3 h-12 transition-colors border-none"
          >
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v2.5A1.75 1.75 0 0 1 13.25 7H2.75A1.75 1.75 0 0 1 1 5.25zm1.75-.25a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25zM1 10.75C1 9.784 1.784 9 2.75 9h10.5c.966 0 1.75.784 1.75 1.75v2.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25zm1.75-.25a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25z" />
              </svg>
              Universal mode
            </div>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={cn("transition-transform duration-200 text-[#847E85]", isUniversalModeOpen && "rotate-180")}>
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M7.116 10.847a1.25 1.25 0 0 0 1.768 0L12.78 6.95a.75.75 0 0 0-1.06-1.06L8 9.61 4.28 5.89a.75.75 0 0 0-1.06 1.06z" />
            </svg>
          </button>
          
          {isUniversalModeOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-xl shadow-lg z-50 overflow-hidden">
              <button className="w-full text-left px-4 py-3 bg-[#f7f5f8] hover:bg-[#f0eeef] transition-colors border-b border-[#f0eeef]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-[#3C323E]">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v2.5A1.75 1.75 0 0 1 13.25 7H2.75A1.75 1.75 0 0 1 1 5.25zm1.75-.25a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25zM1 10.75C1 9.784 1.784 9 2.75 9h10.5c.966 0 1.75.784 1.75 1.75v2.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25zm1.75-.25a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25z"/></svg>
                  </div>
                  <div>
                    <div className="text-[15px] text-[#3C323E]">Universal mode</div>
                    <div className="text-[13px] text-[#655D67]">Create any form.</div>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))}
                className="w-full text-left px-4 py-3 bg-white hover:bg-[#f7f5f8] transition-colors border-b border-[#f0eeef]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-[#655D67]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>
                  </div>
                  <div>
                    <div className="text-[15px] text-[#655D67]">Lead qualification mode</div>
                    <div className="text-[13px] text-[#847E85]">Score and prioritize leads.</div>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))}
                className="w-full text-left px-4 py-3 bg-white hover:bg-[#f7f5f8] transition-colors border-b border-[#f0eeef]"
              >
                <div className="flex items-start gap-3 justify-between">
                  <div className="flex gap-3">
                    <div className="mt-0.5 text-[#655D67]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h7"/></svg>
                    </div>
                    <div>
                      <div className="text-[15px] text-[#655D67]">Knowledge quiz mode</div>
                      <div className="text-[13px] text-[#847E85]">Set correct answers.</div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#E5F3F1] border border-[#6BB6AA] flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#196042" strokeWidth="2"><path d="M2 12l10-10 10 10-10 10Z"/></svg>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))}
                className="w-full text-left px-4 py-3 bg-white hover:bg-[#f7f5f8] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-[#655D67]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <div>
                    <div className="text-[15px] text-[#655D67]">Match quiz mode</div>
                    <div className="text-[13px] text-[#847E85]">Assign answers to endings.</div>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Pages Card */}
        <div className="bg-[#F7F7F8] rounded-2xl flex flex-col flex-1 min-h-0 pt-3 pb-2 border-none">
          {/* Pages Header */}
          <div className="px-4 shrink-0 flex items-center justify-between mb-2">
            <h3 className="text-[13px] font-semibold text-[#3C323E]">
              Pages
            </h3>
          </div>

          {/* Scrollable container for Pages */}
          <div className="flex-1 min-h-0 overflow-y-auto px-2 custom-scrollbar">
            {form.questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center px-4">
                <p className="text-xs text-[#847E85]">
                  No questions yet. Add content below.
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="space-y-0 px-2 pb-4 pt-2">
                  <DropIndicator id="drop-top-page" />
                  
                  {(() => {
                    const pages: { parent: Question, children: Question[] }[] = [];
                    let currentPage: { parent: Question, children: Question[] } | null = null;
                    form.questions.forEach(q => {
                      if (!q.parentId) {
                        currentPage = { parent: q, children: [] };
                        pages.push(currentPage);
                      } else if (currentPage) {
                        currentPage.children.push(q);
                      } else {
                        currentPage = { parent: q, children: [] };
                        pages.push(currentPage);
                      }
                    });

                    return pages.map((page, pIndex) => {
                      const hasChildren = page.children.length > 0;
                      const isPageDragging = activeDragId === `page-${page.parent.id}`;
                      const isSingleSectionDragging = !hasChildren && activeDragId === page.parent.id;
                      const isDraggingPageBlock = activeDragId?.startsWith('page-');

                      return (
                      <div key={`page-${page.parent.id}`}>
                        <div className={cn(
                          "bg-transparent border border-[#e4e4e7] p-1 transition-all relative rounded-2xl mb-2",
                          isPageDragging || isSingleSectionDragging ? 'opacity-0 h-0 p-0 m-0 overflow-hidden border-none mb-0' : ''
                        )}>
                          
                          {hasChildren && <PageHeader pageIndex={pIndex} pageId={page.parent.id} onDuplicate={() => duplicateQuestion(form.id, page.parent.id)} onDelete={() => handleDeleteQuestion(page.parent.id)} />}
                          
                          <div className={cn(hasChildren ? "px-1 space-y-0 relative mt-1" : "space-y-0 relative")}>
                            {!isDraggingPageBlock && <DropIndicator id={`drop-before-child-${page.parent.id}`} />}
                            
                            <div className={cn(activeDragId === page.parent.id ? 'opacity-0 h-0 p-0 m-0 overflow-hidden border-none' : '')}>
                              <QuestionListItem
                                question={page.parent}
                                badgeText={String(pIndex + 1)}
                                isSelected={page.parent.id === selectedQuestionId}
                                onSelect={() => handleSelectQuestion(page.parent.id)}
                                onDelete={() => handleDeleteQuestion(page.parent.id)}
                                onDuplicate={() => duplicateQuestion(form.id, page.parent.id)}
                              />
                            </div>
                            
                            {hasChildren && page.children.map((child, cIndex) => {
                              const isChildDragging = activeDragId === child.id;
                              const childLetter = String.fromCharCode(65 + cIndex); // 'A' is 65
                              return (
                                <div key={child.id}>
                                  {!isDraggingPageBlock && <DropIndicator id={`drop-after-child-${cIndex === 0 ? page.parent.id : page.children[cIndex-1].id}`} />}
                                  <div className={cn(isChildDragging ? 'opacity-0 h-0 p-0 m-0 overflow-hidden border-none' : '')}>
                                    <QuestionListItem
                                      question={child}
                                      badgeText={childLetter}
                                      isSelected={child.id === selectedQuestionId}
                                      onSelect={() => handleSelectQuestion(child.id)}
                                      onDelete={() => handleDeleteQuestion(child.id)}
                                      onDuplicate={() => duplicateQuestion(form.id, child.id)}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                            {!isDraggingPageBlock && <DropIndicator id={`drop-after-child-${hasChildren && page.children.length > 0 ? page.children[page.children.length - 1].id : page.parent.id}`} />}
                          </div>
                          
                            <div className="px-1 pb-1 pt-1 mt-1 mx-1">
                              <button
                                onClick={() => {
                                  if (setTargetParentIdForNewQuestion) {
                                    setTargetParentIdForNewQuestion(page.parent.id);
                                  }
                                  setAddContentModalOpen(true);
                                }}
                                className="w-full flex items-center justify-center gap-1.5 text-[13px] font-medium text-[#655D67] hover:text-[#3C323E] bg-[#f0eeef] hover:bg-[#e4e4e7] rounded-lg transition-colors py-2 cursor-pointer"
                              >
                                <IconPlus size={14} />
                                Add content
                              </button>
                            </div>
                          
                        </div>
                        <DropIndicator id={`drop-after-page-${page.parent.id}`} />
                      </div>
                    )});
                  })()}
                </div>
                
                {typeof window !== 'undefined' && createPortal(
                  <DragOverlay dropAnimation={null}>
                    {activeDragId && activeQuestion ? (
                      activeDragId.startsWith('page-') ? (
                        <div className="w-[240px]">
                          {(() => {
                            const pageId = activeDragId.replace('page-', '');
                            const pageIndex = form.questions.filter(q => !q.parentId).findIndex(q => q.id === pageId);
                            return <PageHeader pageIndex={pageIndex >= 0 ? pageIndex : 0} pageId={pageId} isOverlay />;
                          })()}
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl shadow-xl border border-[#e4e4e7] p-1">
                          <QuestionListItem
                            question={activeQuestion}
                            isSelected={true}
                            onSelect={() => {}}
                            onDelete={() => {}}
                            isOverlay
                          />
                        </div>
                      )
                    ) : null}
                  </DragOverlay>,
                  document.body
                )}
              </DndContext>
            )}
          </div>
        </div>

        {/* Removed Global Add content button as requested */}

        {/* Endings Card */}
        <div className="bg-[#F7F7F8] rounded-2xl p-2 shrink-0 border-none">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-[13px] font-medium text-[#3C323E]">
              Endings
            </span>
            <button 
              onClick={() => import('react-hot-toast').then(m => m.default('Coming soon', { icon: '🚧' }))}
              className="p-1 text-[#847E85] hover:text-[#3C323E] hover:bg-[#f0eeef] bg-white rounded-md transition-colors border border-[#e4e4e7]"
            >
              <IconPlus size={12} />
            </button>
          </div>
        </div>

      </aside>

      {/* Add Content Modal */}
      <AddContentModal
        open={isAddContentModalOpen}
        onClose={() => setAddContentModalOpen(false)}
        onSelect={handleAddQuestion}
      />
    </>
  );
}
