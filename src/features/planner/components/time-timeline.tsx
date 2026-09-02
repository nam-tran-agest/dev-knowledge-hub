'use client';

import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { usePlannerStore } from '@/features/planner/store/usePlannerStore';
import { TaskItem } from './task-item';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';
import { getTodayDateStr } from '../utils/date';

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6).map(h => {
    return `${h.toString().padStart(2, '0')}:00`;
});

interface TimeTimelineProps {
    onTaskClick?: (taskId: string) => void;
}

export const TimeTimeline: React.FC<TimeTimelineProps> = () => {
    const tasks = usePlannerStore(state => state.tasks);
    const schedules = usePlannerStore(state => state.schedules);
    const selectedDate = usePlannerStore(state => state.selectedDate);
    const addTask = usePlannerStore(state => state.addTask);

    const [activeAddingHour, setActiveAddingHour] = useState<string | null>(null);
    const [inlineTaskTitle, setInlineTaskTitle] = useState('');

    const realTodayStr = getTodayDateStr();
    const targetDateStr = selectedDate || realTodayStr;
    const isViewingToday = targetDateStr === realTodayStr;

    const currentTaskIds = schedules[targetDateStr]?.tasks || [];
    const currentTasks = currentTaskIds.map(id => tasks[id]).filter(Boolean);

    const handleAddInline = (hour: string) => {
        if (!inlineTaskTitle.trim()) {
            setActiveAddingHour(null);
            return;
        }
        addTask(inlineTaskTitle.trim(), targetDateStr, hour);
        setInlineTaskTitle('');
        setActiveAddingHour(null);
    };

    return (
        <div className="flex flex-col gap-2 relative">
            {/* Center Vertical Neon Wire */}
            <div className="absolute left-[72px] top-0 bottom-0 w-[1px] bg-primary/20 pointer-events-none" />

            {HOURS.map((hour) => {
                const tasksInThisBlock = currentTasks.filter(t => t.timeBlockId === hour);
                const hourNum = parseInt(hour.split(':')[0]);
                const isCurrentHour = isViewingToday && new Date().getHours() === hourNum;
                const isAddingHere = activeAddingHour === hour;

                return (
                    <Droppable key={hour} droppableId={`timeblock-${hour}`}>
                        {(provided, snapshot) => (
                            <div
                                className="flex gap-4 min-h-[52px] relative group"
                            >
                                {/* Time Label */}
                                <div className="w-16 flex justify-end text-xs font-mono font-medium pt-2 select-none">
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
                                    "absolute left-[69px] top-3.5 w-2 h-2 border z-10 transition-all duration-300 pointer-events-none",
                                    isCurrentHour
                                        ? "bg-primary border-primary shadow-[0_0_12px_var(--color-primary)] scale-125"
                                        : "border-primary/30 bg-surface group-hover:border-primary group-hover:scale-125"
                                )} />

                                {/* Drop Zone */}
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn(
                                        "flex-1 p-2 cyber-clip-button transition-all min-h-[52px] flex flex-col justify-center",
                                        snapshot.isDraggingOver
                                            ? "bg-primary/20 border border-primary/60 shadow-[inset_0_0_20px_rgba(0,240,255,0.3)] ring-1 ring-primary"
                                            : "bg-transparent border border-primary/10 hover:border-primary/30 hover:bg-primary/[0.03]"
                                    )}
                                >
                                    {tasksInThisBlock.map((task, index) => (
                                        <TaskItem key={task.id} task={task} index={index} />
                                    ))}
                                    {provided.placeholder}

                                    {/* Inline Add Task Form */}
                                    {isAddingHere ? (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleAddInline(hour);
                                            }}
                                            className="flex items-center gap-2 p-1.5 bg-surface-deep/95 border border-primary cyber-clip-button animate-in fade-in duration-150"
                                        >
                                            <input
                                                autoFocus
                                                type="text"
                                                value={inlineTaskTitle}
                                                onChange={(e) => setInlineTaskTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') setActiveAddingHour(null);
                                                }}
                                                placeholder={`Task at ${hour}...`}
                                                className="flex-1 bg-transparent px-2 py-1 text-xs font-mono text-white focus:outline-none placeholder:text-primary/40"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!inlineTaskTitle.trim()}
                                                className="p-1 bg-primary hover:bg-primary/90 text-black cyber-clip-button text-[10px] font-bold"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveAddingHour(null)}
                                                className="p-1 text-primary/60 hover:text-white"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </form>
                                    ) : (
                                        tasksInThisBlock.length === 0 && !snapshot.isDraggingOver && (
                                            <div className="opacity-0 group-hover:opacity-100 h-full flex items-center justify-between px-3 text-[10px] font-mono uppercase tracking-widest text-primary/40 transition-opacity">
                                                <span>// EMPTY_BLOCK</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveAddingHour(hour);
                                                        setInlineTaskTitle('');
                                                    }}
                                                    className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 cyber-clip-button transition-colors cursor-pointer"
                                                >
                                                    <Plus className="w-2.5 h-2.5" />
                                                    <span>ADD</span>
                                                </button>
                                            </div>
                                        )
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
