'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { PlannerTask, usePlannerStore } from '@/store/usePlannerStore';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
    task: PlannerTask;
    index: number;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, index }) => {
    const { updateTaskStatus } = usePlannerStore();
    const isCompleted = task.status === 'done';

    const toggleStatus = (e: React.MouseEvent) => {
        // Prevent drag when clicking the checkbox
        e.stopPropagation();
        updateTaskStatus(task.id, isCompleted ? 'todo' : 'done');
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                        "group flex items-center p-3 mb-2 rounded-xl transition-all duration-200 border",
                        "bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:border-white/20",
                        snapshot.isDragging && "shadow-lg shadow-black/50 border-white/30 rotate-1 scale-105 z-50",
                        isCompleted && "opacity-50"
                    )}
                    style={{
                        ...provided.draggableProps.style,
                    }}
                >
                    <button
                        onClick={toggleStatus}
                        className="mr-3 text-slate-400 hover:text-white transition-colors focus:outline-none"
                    >
                        {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400 animate-in zoom-in duration-200" />
                        ) : (
                            <Circle className="w-5 h-5" />
                        )}
                    </button>

                    <span
                        className={cn(
                            "flex-1 text-sm font-medium transition-all duration-200",
                            isCompleted ? "text-slate-400 opacity-60 line-through" : "text-slate-200"
                        )}
                    >
                        {task.title}
                    </span>

                    {/* Visual drag handle indicator shown on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col gap-[2px] cursor-grab active:cursor-grabbing p-1">
                            <div className="w-1 h-1 rounded-full bg-slate-500" />
                            <div className="w-1 h-1 rounded-full bg-slate-500" />
                            <div className="w-1 h-1 rounded-full bg-slate-500" />
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};
