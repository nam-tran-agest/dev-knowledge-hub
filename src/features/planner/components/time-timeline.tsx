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
            {/* Center Vertical Neon Wire */}
            <div className="absolute left-[72px] top-0 bottom-0 w-[1px] bg-primary/20" />

            {HOURS.map((hour) => {
                const tasksInThisBlock = todaysTasks.filter(t => t.timeBlockId === hour);
                const isCurrentHour = new Date().getHours() === parseInt(hour.split(':')[0]);

                return (
                    <Droppable key={hour} droppableId={`timeblock-${hour}`}>
                        {(provided, snapshot) => (
                            <div
                                className="flex gap-4 min-h-[56px] relative group"
                            >
                                {/* Time Label */}
                                <div className="w-16 flex justify-end text-xs font-mono font-medium pt-2">
                                    <span className={cn(
                                        "px-2 py-0.5 cyber-clip-button transition-all duration-300",
                                        isCurrentHour
                                            ? "bg-primary text-black font-bold shadow-[0_0_15px_var(--color-primary)] border border-primary"
                                            : "text-primary/50 group-hover:text-primary border border-transparent group-hover:border-primary/30"
                                    )}>
                                        {hour}
                                    </span>
                                </div>

                                {/* Timeline Node */}
                                <div className={cn(
                                    "absolute left-[69px] top-3.5 w-2 h-2 border z-10 transition-all duration-300",
                                    isCurrentHour
                                        ? "bg-primary border-primary shadow-[0_0_12px_var(--color-primary)] scale-125"
                                        : "border-primary/30 bg-surface group-hover:border-primary group-hover:scale-125"
                                )} />

                                {/* Drop Zone */}
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn(
                                        "flex-1 p-2 cyber-clip-button transition-all min-h-[56px]",
                                        snapshot.isDraggingOver
                                            ? "bg-primary/15 border border-primary/50 shadow-[inset_0_0_20px_rgba(0,240,255,0.2)]"
                                            : "bg-transparent border border-primary/10 hover:border-primary/30 hover:bg-primary/[0.03]"
                                    )}
                                >
                                    {tasksInThisBlock.map((task, index) => (
                                        <TaskItem key={task.id} task={task} index={index} />
                                    ))}
                                    {provided.placeholder}

                                    {/* Empty state hint */}
                                    {tasksInThisBlock.length === 0 && !snapshot.isDraggingOver && (
                                        <div className="opacity-0 group-hover:opacity-100 h-full flex items-center px-4 text-[10px] font-mono uppercase tracking-widest text-primary/40 transition-opacity">
                                            // DROP_TASK_BLOCK
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
