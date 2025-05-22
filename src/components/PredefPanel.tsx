import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DraggableItem from './DraggableItem';

interface PredefPanelProps {
  items: Array<{ id: string; content: string }>;
}

/**
 * PredefPanel component renders a droppable area that contains a list of draggable items.
 * 
 * @param {Object} props - The props for the component.
 * @param {Array} props.items - An array of items to be rendered as draggable elements.
 * Each item should have an `id` and `content` property.
 */

const PredefPanel: React.FC<PredefPanelProps> = ({ items }) => {
  return (
    <Droppable droppableId="predefined-panel">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`bg-white border border-slate-300 rounded-lg p-3 min-h-[400px] overflow-y-auto transition-all ${
            snapshot.isDraggingOver ? 'bg-slate-50' : ''
          } cursor-move`}
        >
          <div className="space-y-2">
            {items.map((item, index) => (
              <DraggableItem 
                key={index} 
                id={item.id} 
                content={item.content} 
                index={index} 
              />
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default PredefPanel;