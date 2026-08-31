'use client';

import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { PlannerTask, usePlannerStore } from '@/features/planner/store/usePlannerStore';
import { 
    CheckCircle2, 
    Circle, 
    GripVertical, 
    MoreHorizontal, 
    Clock, 
    Trash2, 
    Edit2, 
    Inbox,
    ArrowRight,
    Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TIME_OPTIONS = Array.from({ length: 17 }, (_, i) => i + 6).map(h => {
    return `${h.toString().padStart(2, '0')}:00`;
});

interface TaskItemProps {
    task: PlannerTask;
    index: number;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, index }) => {
    const { 
        updateTaskStatus, 
        deleteTask, 
        editTask, 
        moveTask, 
        clearTaskTimeBlock,
        moveTaskToSomeday 
    } = usePlannerStore();
    
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.title);

    const isCompleted = task.status === 'done';

    const toggleStatus = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateTaskStatus(task.id, isCompleted ? 'todo' : 'done');
    };

    const handleSaveEdit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (editValue.trim() && editValue !== task.title) {
            editTask(task.id, editValue.trim());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSaveEdit();
        if (e.key === 'Escape') {
            setEditValue(task.title);
            setIsEditing(false);
        }
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                        "group flex items-center p-2.5 mb-2 cyber-clip-button transition-colors duration-150 border",
                        "bg-[#040712]/90 backdrop-blur-xl border-primary/25 hover:border-primary/60 relative overflow-hidden",
                        snapshot.isDragging && "shadow-[0_0_25px_rgba(0,240,255,0.6)] border-primary bg-[#08102a] z-50",
                        isCompleted && "opacity-50 grayscale"
                    )}
                    style={{
                        ...provided.draggableProps.style,
                    }}
                >
                    {/* Top corner accent */}
                    <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-primary/40 pointer-events-none" />

                    {/* Drag Handle */}
                    <div
                        {...provided.dragHandleProps}
                        className="mr-2 text-primary/40 group-hover:text-primary cursor-grab active:cursor-grabbing transition-colors"
                        title="Drag to rearrange or drop into a time block"
                    >
                        <GripVertical className="w-3.5 h-3.5" />
                    </div>

                    {/* Status Checkbox */}
                    <button
                        type="button"
                        onClick={toggleStatus}
                        className="mr-2.5 text-primary/60 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                        title={isCompleted ? "Mark as Incomplete" : "Mark as Done"}
                    >
                        {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-in zoom-in duration-200" />
                        ) : (
                            <Circle className="w-4 h-4" />
                        )}
                    </button>

                    {/* Task Title / Inline Edit */}
                    {isEditing ? (
                        <form onSubmit={handleSaveEdit} className="flex-1 flex items-center gap-1.5 mr-2">
                            <input
                                autoFocus
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={() => handleSaveEdit()}
                                className="flex-1 bg-surface-deep/95 border border-primary px-2 py-0.5 text-xs font-mono text-white focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="p-1 bg-primary text-black cyber-clip-button text-[10px]"
                            >
                                <Check className="w-3 h-3" />
                            </button>
                        </form>
                    ) : (
                        <span
                            onDoubleClick={() => setIsEditing(true)}
                            className={cn(
                                "flex-1 text-xs font-mono tracking-wide transition-all duration-200 cursor-text select-none truncate mr-2",
                                isCompleted ? "text-primary/40 line-through" : "text-slate-200 group-hover:text-white"
                            )}
                            title={task.title}
                        >
                            {task.title}
                        </span>
                    )}

                    {/* Assigned Time Tag if present */}
                    {task.timeBlockId && !isEditing && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono text-primary/80 bg-primary/10 border border-primary/30 mr-1 shrink-0">
                            <Clock className="w-2.5 h-2.5" />
                            {task.timeBlockId}
                        </span>
                    )}

                    {/* Action Dropdown Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="opacity-0 group-hover:opacity-100 p-1 text-primary/60 hover:text-primary hover:bg-primary/10 cyber-clip-button transition-all cursor-pointer focus:opacity-100"
                                title="Task options"
                            >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-surface-deep/95 border-primary/40 text-xs font-mono">
                            <DropdownMenuLabel className="text-[10px] text-primary/60 uppercase tracking-widest">
                                // TASK_ACTIONS
                            </DropdownMenuLabel>
                            
                            <DropdownMenuItem 
                                onClick={() => setIsEditing(true)}
                                className="cursor-pointer flex items-center gap-2 hover:bg-primary/20 text-slate-200 hover:text-white"
                            >
                                <Edit2 className="w-3.5 h-3.5 text-primary" />
                                <span>Edit Title</span>
                            </DropdownMenuItem>

                            {/* Quick Time Block Assignment Submenu */}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="cursor-pointer flex items-center gap-2 hover:bg-primary/20 text-slate-200">
                                    <Clock className="w-3.5 h-3.5 text-primary" />
                                    <span>Assign Time</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="max-h-56 overflow-y-auto custom-scrollbar bg-surface-deep/95 border-primary/40">
                                    <DropdownMenuItem
                                        onClick={() => clearTaskTimeBlock(task.id)}
                                        className="cursor-pointer text-cyan-400 hover:bg-primary/20 flex items-center gap-1.5"
                                    >
                                        <ArrowRight className="w-3 h-3" />
                                        <span>[ Buffer / Unassigned ]</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-primary/20" />
                                    {TIME_OPTIONS.map((time) => (
                                        <DropdownMenuItem
                                            key={time}
                                            onClick={() => moveTask(task.id, undefined, time)}
                                            className={cn(
                                                "cursor-pointer flex items-center justify-between hover:bg-primary/20",
                                                task.timeBlockId === time ? "text-primary font-bold bg-primary/10" : "text-slate-300"
                                            )}
                                        >
                                            <span>{time}</span>
                                            {task.timeBlockId === time && <Check className="w-3 h-3 text-primary" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            {/* Move to Someday */}
                            {task.date !== 'someday' && (
                                <DropdownMenuItem 
                                    onClick={() => moveTaskToSomeday(task.id)}
                                    className="cursor-pointer flex items-center gap-2 hover:bg-primary/20 text-slate-200"
                                >
                                    <Inbox className="w-3.5 h-3.5 text-primary" />
                                    <span>Move to Someday</span>
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator className="bg-primary/20" />

                            <DropdownMenuItem 
                                onClick={() => deleteTask(task.id)}
                                className="cursor-pointer flex items-center gap-2 text-destructive hover:bg-destructive/20 focus:bg-destructive/20 focus:text-destructive"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Task</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </Draggable>
    );
};
