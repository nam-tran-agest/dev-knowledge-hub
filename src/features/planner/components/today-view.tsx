'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { usePlannerStore } from '@/store/usePlannerStore';
import { TimeTimeline } from './time-timeline';
import { TaskItem } from './task-item';
import { Plus, CheckCircle2, Sparkles } from 'lucide-react';
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
            <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 min-h-[85vh] pt-32 p-6 animate-fade-in-up">

                {/* Left Column: Timeline */}
                <div className="flex-[2] rounded-3xl bg-[#070d1e]/50 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-y-auto max-h-[80vh] custom-scrollbar glare-top">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            {tNav('items.today')}
                            <span suppressHydrationWarning className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">Schedule your deep work blocks and high-impact sessions.</p>
                    </div>

                    <TimeTimeline />
                </div>

                {/* Right Column: Task Backlog */}
                <div className="flex-1 rounded-3xl bg-[#070d1e]/50 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl flex flex-col max-h-[80vh] glare-top">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-white tracking-tight">Daily Queue</h3>
                        <p className="text-xs font-mono text-slate-400 mt-1">Unassigned tasks for today</p>
                    </div>

                    {/* Add Task Input */}
                    <form onSubmit={handleAddTask} className="mb-6 relative">
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Type a new task & press Enter..."
                            className="w-full bg-[#040711]/80 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all pr-12"
                        />
                        <button
                            type="submit"
                            disabled={!newTaskTitle.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 transition-all cursor-pointer shadow-md"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </form>

                    <Droppable droppableId="unassigned-tasks">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex-1 overflow-y-auto custom-scrollbar min-h-[100px] rounded-2xl transition-all p-1 ${snapshot.isDraggingOver ? 'bg-indigo-500/10 ring-1 ring-indigo-500/30' : ''
                                    }`}
                            >
                                {unassignedTasks.map((task, index) => (
                                    <TaskItem key={task.id} task={task} index={index} />
                                ))}
                                {provided.placeholder}

                                {unassignedTasks.length === 0 && !snapshot.isDraggingOver && (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 border-2 border-dashed border-white/10 rounded-2xl p-6">
                                        <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6 text-indigo-400/50" />
                                        </div>
                                        <p className="text-xs font-mono text-center text-slate-400">Queue empty. Add a task or drag here.</p>
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
