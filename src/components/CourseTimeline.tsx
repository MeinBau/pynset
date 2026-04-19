import React from 'react';
import { motion, Reorder, useDragControls } from 'motion/react';
import { Place } from '../types';
import { Clock, RefreshCw, X, GripVertical } from 'lucide-react';

interface CourseTimelineProps {
  places: Place[];
  onReorder: (newPlaces: Place[]) => void;
  onRemove?: (id: string) => void;
  onRefresh?: (id: string) => void;
}

export default function CourseTimeline({ places, onReorder, onRemove, onRefresh }: CourseTimelineProps) {
  return (
    <Reorder.Group 
      axis="y" 
      values={places} 
      onReorder={onReorder}
      className="flex flex-col gap-3 w-full max-w-md mx-auto"
    >
      {places.map((place, index) => (
        <Reorder.Item
          key={place.id}
          value={place}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 group cursor-default"
        >
          <div className="text-gray-300 cursor-grab active:cursor-grabbing">
            <GripVertical size={20} />
          </div>
          
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold
            ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-yellow-500' : 'bg-green-500'}
          `}>
            {index + 1}
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-sm">{place.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-1">{place.description}</p>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onRefresh?.(place.id)}
              className="p-2 hover:bg-gray-50 rounded-full text-gray-400"
            >
              <RefreshCw size={16} />
            </button>
            <button 
              onClick={() => onRemove?.(place.id)}
              className="p-2 hover:bg-red-50 rounded-full text-red-400"
            >
              <X size={16} />
            </button>
          </div>
        </Reorder.Item>
      ))}
      
      {places.length === 0 && (
        <div className="py-12 text-center text-gray-400 text-sm">
          코스를 선택하면 여기에 일정이 표시됩니다.
        </div>
      )}
    </Reorder.Group>
  );
}
