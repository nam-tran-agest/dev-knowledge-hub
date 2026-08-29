'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { usePlannerStore } from '@/features/planner/store/usePlannerStore';
import { TimeTimeline } from './time-timeline';
import { TaskItem } from './task-item';
import { Plus, CheckCircle2, Activity, Terminal } from 'lucide-react';
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
    const completedCount = todaysTasks.filter(t => t.status === 'done').length;

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
            <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 min-h-[85vh] pt-24 pb-12 px-4 sm:px-6">

                {/* Left Column: Timeline Control Deck */}
                <div className="flex-[2] cyber-clip glass-panel border border-primary/30 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col max-h-[82vh]">
                    {/* Corner Brackets */}
                    <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-60" />
                    
                    {/* Header Tag */}
                    <div className="absolute top-4 right-6 px-3 py-1 bg-primary/10 border border-primary/30 cyber-clip-tag text-[10px] uppercase tracking-widest text-primary font-mono font-bold">
                        // SYS_SCHEDULE_TIMELINE
                    </div>

                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/20 pb-4">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                {tNav('items.today')}
                                <span suppressHydrationWarning className="text-xs font-mono font-semibold px-2.5 py-0.5 cyber-clip-button bg-primary/15 border border-primary/40 text-primary">
                                    [ {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} ]
                                </span>
                            </h2>
                            <p className="text-primary/60 font-mono text-xs mt-1 uppercase tracking-wide">
                                // Schedule high-impact execution blocks
                            </p>
                        </div>

                        {/* Telemetry Progress Pill */}
                        <div className="flex items-center gap-2 font-mono text-xs text-primary/80 bg-primary/10 border border-primary/30 px-3 py-1.5 cyber-clip-button w-fit">
                            <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
                            <span>COMPLETED: {completedCount}/{todaysTasks.length}</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <TimeTimeline />
                    </div>
                </div>

                {/* Right Column: Task Queue Backlog */}
                <div className="flex-1 cyber-clip glass-panel border border-primary/30 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col max-h-[82vh] relative overflow-hidden">
                    {/* Corner Brackets */}
                    <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-60" />
                    
                    {/* Header Tag */}
                    <div className="absolute top-4 right-6 px-3 py-1 bg-primary/10 border border-primary/30 cyber-clip-tag text-[10px] uppercase tracking-widest text-primary font-mono font-bold">
                        // SYS_TASK_QUEUE
                    </div>

                    <div className="mb-6 border-b border-primary/20 pb-4">
                        <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-primary" />
                            Task Buffer
                        </h3>
                        <p className="text-[10px] font-mono text-primary/60 mt-1 uppercase tracking-wide">
                            // Unassigned tasks waiting for allocation
                        </p>
                    </div>

                    {/* Add Task Input */}
                    <form onSubmit={handleAddTask} className="mb-6 relative">
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="INPUT_TASK_TITLE..."
                            className="w-full bg-[#040711]/90 border border-primary/30 cyber-clip-button px-4 py-2.5 text-xs font-mono text-white placeholder:text-primary/40 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all pr-12"
                        />
                        <button
                            type="submit"
                            disabled={!newTaskTitle.trim()}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 cyber-clip-button bg-primary/20 hover:bg-primary text-primary hover:text-black border border-primary/40 disabled:opacity-30 transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </form>

                    <Droppable droppableId="unassigned-tasks">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex-1 overflow-y-auto custom-scrollbar min-h-[120px] cyber-clip transition-all p-1.5 ${
                                    snapshot.isDraggingOver ? 'bg-primary/10 border border-primary/50 shadow-[0_0_20px_rgba(0,240,255,0.2)]' : ''
                                }`}
                            >
                                {unassignedTasks.map((task, index) => (
                                    <TaskItem key={task.id} task={task} index={index} />
                                ))}
                                {provided.placeholder}

                                {unassignedTasks.length === 0 && !snapshot.isDraggingOver && (
                                    <div className="h-full flex flex-col items-center justify-center text-primary/40 gap-3 border border-dashed border-primary/20 cyber-clip-button p-6 relative overflow-hidden">
                                        <div className="absolute inset-0 hazard-stripes-cyan opacity-5 pointer-events-none" />
                                        <div className="w-10 h-10 cyber-clip-button bg-primary/10 border border-primary/30 flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-primary/70" />
                                        </div>
                                        <p className="text-[10px] font-mono uppercase tracking-widest text-center text-primary/60">
                                            [ BUFFER_EMPTY ]
                                        </p>
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
