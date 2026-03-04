'use client';

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { usePlannerStore } from '@/store/usePlannerStore';
import { TaskItem } from './task-item';
import { cn } from '@/lib/utils';

// Generate hours from 6 AM to 10 PM
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6).map(h => {
    return `${h.toString().padStart(2, '0')}:00`;
});

export const TimeTimeline: React.FC = () => {
    const tasks = usePlannerStore(state => state.tasks);
    const schedules = usePlannerStore(state => state.schedules);

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysTaskIds = schedules[todayStr]?.tasks || [];
    const todaysTasks = todaysTaskIds.map(id => tasks[id]).filter(Boolean);

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="absolute left-[70px] top-0 bottom-0 w-[1px] bg-white/10" />

            {HOURS.map((hour) => {
                const tasksInThisBlock = todaysTasks.filter(t => t.timeBlockId === hour);
                const isCurrentHour = new Date().getHours() === parseInt(hour.split(':')[0]);

                return (
                    <Droppable key={hour} droppableId={`timeblock-${hour}`}>
                        {(provided, snapshot) => (
                            <div
                                className="flex gap-4 min-h-[60px] relative group"
                            >
                                {/* Time Label */}
                                <div className="w-16 flex justify-end text-xs font-medium pt-2">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full transition-colors",
                                        isCurrentHour ? "bg-white text-black shadow-md shadow-white/20" : "text-slate-500 group-hover:text-slate-300"
                                    )}>
                                        {hour}
                                    </span>
                                </div>

                                {/* Timeline Node */}
                                <div className="absolute left-[67px] top-3 w-2 h-2 rounded-full border border-white/20 bg-[#050505] z-10 
                                      group-hover:border-white/50 group-hover:scale-125 transition-all" />

                                {/* Drop Zone */}
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn(
                                        "flex-1 p-2 rounded-xl transition-colors min-h-[60px]",
                                        snapshot.isDraggingOver ? "bg-white/10 border border-white/20 ring-1 ring-white/10 ring-offset-1 ring-offset-[#050505]" : "bg-transparent border border-transparent hover:bg-white/[0.02]"
                                    )}
                                >
                                    {tasksInThisBlock.map((task, index) => (
                                        <TaskItem key={task.id} task={task} index={index} />
                                    ))}
                                    {provided.placeholder}

                                    {/* Empty state hint */}
                                    {tasksInThisBlock.length === 0 && !snapshot.isDraggingOver && (
                                        <div className="opacity-0 group-hover:opacity-100 h-full flex items-center px-4 text-xs text-slate-600 transition-opacity">
                                            Drop task here
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </Droppable>
                );
            })}
        </div>
    );
};
