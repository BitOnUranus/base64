import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DraggableItem from './DraggableItem';

interface PredefPanelProps {
  items: Array<{ id: string; content: string }>;
}

const PredefPanel: React.FC<PredefPanelProps> = ({ items }) => {
  return (
    <Droppable droppableId="predefined-panel">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`bg-white border border-slate-300 rounded-lg p-3 min-h-[400px] overflow-y-auto transition-all ${
            snapshot.isDraggingOver ? 'bg-slate-50' : ''
          }`}
        >
          {items.map((item, index) => (
            <DraggableItem 
              key={item.id}
              id={item.id} 
              content={item.content} 
              index={index} 
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default PredefPanel;