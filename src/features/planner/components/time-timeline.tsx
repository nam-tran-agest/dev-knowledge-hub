'use client';

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { usePlannerStore } from '@/features/planner/store/usePlannerStore';
import { TaskItem } from './task-item';
import { cn } from '@/lib/utils';

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
                                <div className="w-16 flex justify-end text-xs font-mono font-medium pt-2">
                                    <span className={cn(
                                        "px-2.5 py-0.5 rounded-full transition-all duration-300",
                                        isCurrentHour
                                            ? "bg-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400"
                                            : "text-slate-500 group-hover:text-slate-300"
                                    )}>
                                        {hour}
                                    </span>
                                </div>

                                {/* Timeline Node */}
                                <div className={cn(
                                    "absolute left-[67px] top-3.5 w-2 h-2 rounded-full border z-10 transition-all duration-300",
                                    isCurrentHour
                                        ? "bg-indigo-500 border-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.8)] scale-125"
                                        : "border-white/20 bg-[#070d1e] group-hover:border-indigo-400 group-hover:scale-125"
                                )} />

                                {/* Drop Zone */}
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn(
                                        "flex-1 p-2 rounded-2xl transition-all min-h-[60px]",
                                        snapshot.isDraggingOver
                                            ? "bg-indigo-500/10 border border-indigo-500/30 ring-1 ring-indigo-500/20"
                                            : "bg-transparent border border-transparent hover:bg-white/[0.02]"
                                    )}
                                >
                                    {tasksInThisBlock.map((task, index) => (
                                        <TaskItem key={task.id} task={task} index={index} />
                                    ))}
                                    {provided.placeholder}

                                    {/* Empty state hint */}
                                    {tasksInThisBlock.length === 0 && !snapshot.isDraggingOver && (
                                        <div className="opacity-0 group-hover:opacity-100 h-full flex items-center px-4 text-xs font-mono text-slate-600 transition-opacity">
                                            + Drop block
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
