import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { GripVertical } from 'lucide-react';

interface DraggableItemProps {
  id: string;
  content: string;
  index: number;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, content, index }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`
            p-3 rounded-md shadow-sm border border-slate-200 
            ${snapshot.isDragging ? 'bg-teal-50 border-teal-200 shadow-md' : 'bg-white hover:bg-slate-50'} 
            transition-all ease-in-out duration-200
          `}
        >
          <div className="flex items-center">
            <div
              {...provided.dragHandleProps}
              className="mr-3 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={18} />
            </div>
            <p className="text-sm">{content}</p>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableItem;