'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { PlannerTask, usePlannerStore } from '@/features/planner/store/usePlannerStore';
import { CheckCircle2, Circle, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
    task: PlannerTask;
    index: number;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, index }) => {
    const { updateTaskStatus } = usePlannerStore();
    const isCompleted = task.status === 'done';

    const toggleStatus = (e: React.MouseEvent) => {
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
                        "group flex items-center p-3 mb-2 cyber-clip-button transition-all duration-200 border",
                        "bg-[#040712]/80 backdrop-blur-xl border-primary/20 hover:bg-primary/10 hover:border-primary/50 cursor-grab active:cursor-grabbing relative overflow-hidden",
                        snapshot.isDragging && "shadow-[0_0_25px_rgba(0,240,255,0.4)] border-primary rotate-1 scale-105 z-50 bg-[#060a1e]",
                        isCompleted && "opacity-40 grayscale"
                    )}
                    style={{
                        ...provided.draggableProps.style,
                    }}
                >
                    {/* Top corner accent */}
                    <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-primary/40 pointer-events-none" />

                    <button
                        onClick={toggleStatus}
                        className="mr-3 text-primary/60 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                    >
                        {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-in zoom-in duration-200" />
                        ) : (
                            <Circle className="w-4 h-4" />
                        )}
                    </button>

                    <span
                        className={cn(
                            "flex-1 text-xs font-mono tracking-wide transition-all duration-200",
                            isCompleted ? "text-primary/40 line-through" : "text-slate-200 group-hover:text-white"
                        )}
                    >
                        {task.title}
                    </span>

                    {/* Visual drag handle indicator shown on hover */}
                    <div className="opacity-0 group-hover:opacity-100 text-primary/60 transition-opacity">
                        <GripVertical className="w-3.5 h-3.5" />
                    </div>
                </div>
            )}
        </Draggable>
    );
};
