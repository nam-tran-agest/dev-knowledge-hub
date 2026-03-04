'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { usePlannerStore } from '@/store/usePlannerStore';
import { TimeTimeline } from './time-timeline';
import { TaskItem } from './task-item';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const TodayView = () => {
    const moveTask = usePlannerStore(state => state.moveTask);
    const addTask = usePlannerStore(state => state.addTask);
    const tasks = usePlannerStore(state => state.tasks);
    const schedules = usePlannerStore(state => state.schedules);

    const todayStr = new Date().toISOString().split('T')[0];
    const [isMounted, setIsMounted] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const tNav = useTranslations('navigation.items.planner');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // SSR bailout for drag-and-drop
    if (!isMounted) return null;

    const todaysTaskIds = schedules[todayStr]?.tasks || [];
    const todaysTasks = todaysTaskIds.map(id => tasks[id]).filter(Boolean);
    const unassignedTasks = todaysTasks.filter(t => !t.timeBlockId);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newTimeBlockId = destination.droppableId.startsWith('timeblock-')
            ? destination.droppableId.split('timeblock-')[1]
            : undefined;

        moveTask(draggableId, undefined, newTimeBlockId);
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        addTask(newTaskTitle, todayStr);
        setNewTaskTitle('');
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 min-h-[80vh] pt-32 p-6 animate-fade-in-up">

                {/* Left Column: Timeline */}
                <div className="flex-[2] rounded-3xl bg-white/[0.02] border border-white/5 p-6 shadow-2xl backdrop-blur-3xl overflow-y-auto max-h-[80vh] custom-scrollbar">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            {tNav('items.today')}
                            <span suppressHydrationWarning className="text-sm font-medium px-3 py-1 rounded-full bg-white/10 text-slate-300">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                        </h2>
                        <p className="text-slate-400 mt-2">Schedule your deep work blocks and meetings.</p>
                    </div>

                    <TimeTimeline />
                </div>

                {/* Right Column: Task Backlog */}
                <div className="flex-1 rounded-3xl bg-white/[0.02] border border-white/5 p-6 shadow-2xl backdrop-blur-3xl flex flex-col max-h-[80vh]">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-white">Daily Tasks</h3>
                        <p className="text-sm text-slate-400">Unassigned tasks for today</p>
                    </div>

                    {/* Add Task Input */}
                    <form onSubmit={handleAddTask} className="mb-6 relative">
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Add a new task..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors pr-12"
                        />
                        <button
                            type="submit"
                            disabled={!newTaskTitle.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </form>

                    <Droppable droppableId="unassigned-tasks">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex-1 overflow-y-auto custom-scrollbar min-h-[100px] rounded-xl transition-colors ${snapshot.isDraggingOver ? 'bg-white/5 ring-1 ring-white/10' : ''
                                    }`}
                            >
                                {unassignedTasks.map((task, index) => (
                                    <TaskItem key={task.id} task={task} index={index} />
                                ))}
                                {provided.placeholder}

                                {unassignedTasks.length === 0 && !snapshot.isDraggingOver && (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 border-2 border-dashed border-white/10 rounded-xl p-6">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6 text-white/20" />
                                        </div>
                                        <p className="text-sm text-center">All caught up! Add a task or drag here.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Droppable>
                </div>

            </div>
        </DragDropContext>
    );
};

// Simple SVG for empty state
const CheckCircle2 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
)
