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
                        "group flex items-center p-3 mb-2 rounded-2xl transition-all duration-200 border",
                        "bg-[#040711]/60 backdrop-blur-xl border-white/10 hover:bg-[#0c142c]/80 hover:border-indigo-500/40 cursor-grab active:cursor-grabbing",
                        snapshot.isDragging && "shadow-2xl shadow-indigo-500/20 border-indigo-500/50 rotate-1 scale-105 z-50 bg-[#0c142c]",
                        isCompleted && "opacity-40"
                    )}
                    style={{
                        ...provided.draggableProps.style,
                    }}
                >
                    <button
                        onClick={toggleStatus}
                        className="mr-3 text-slate-500 hover:text-indigo-400 transition-colors focus:outline-none cursor-pointer"
                    >
                        {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-in zoom-in duration-200" />
                        ) : (
                            <Circle className="w-4 h-4" />
                        )}
                    </button>

                    <span
                        className={cn(
                            "flex-1 text-xs sm:text-sm font-medium transition-all duration-200",
                            isCompleted ? "text-slate-500 line-through" : "text-slate-200 group-hover:text-white"
                        )}
                    >
                        {task.title}
                    </span>

                    {/* Visual drag handle indicator shown on hover */}
                    <div className="opacity-0 group-hover:opacity-100 text-slate-500 transition-opacity">
                        <GripVertical className="w-3.5 h-3.5" />
                    </div>
                </div>
            )}
        </Draggable>
    );
};
