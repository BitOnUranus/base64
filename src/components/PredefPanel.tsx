import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import DraggableItem from './DraggableItem';

interface PredefPanelProps {
  items: Array<{ id: string; content: string }>;
  usedItems: Set<string>;
}

const PredefPanel: React.FC<PredefPanelProps> = ({ items, usedItems }) => {
  const { setNodeRef } = useDroppable({
    id: 'predefined-panel'
  });

  return (
    <div
      ref={setNodeRef}
      className="space-y-2 bg-white border border-slate-300 rounded-lg p-3 min-h-[400px] overflow-y-auto transition-all"
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            id={item.id}
            content={item.content}
            isUsed={usedItems.has(item.id)}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default PredefPanel;