'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { usePlannerStore } from '@/features/planner/store/usePlannerStore';
import { TimeTimeline } from './time-timeline';
import { TaskItem } from './task-item';
import { PlannerNavHeader } from './planner-nav-header';
import { getTodayDateStr, formatDateStr } from '../utils/date';
import { 
    Plus, 
    CheckCircle2, 
    Activity, 
    Terminal, 
    ChevronLeft, 
    ChevronRight, 
    RotateCcw,
    Clock,
    LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export const TodayView = () => {
    const moveTask = usePlannerStore(state => state.moveTask);
    const addTask = usePlannerStore(state => state.addTask);
    const tasks = usePlannerStore(state => state.tasks);
    const schedules = usePlannerStore(state => state.schedules);
    const selectedDate = usePlannerStore(state => state.selectedDate);
    const setSelectedDate = usePlannerStore(state => state.setSelectedDate);
    const loadServerTasks = usePlannerStore(state => state.loadServerTasks);

    const [isMounted, setIsMounted] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [mobileTab, setMobileTab] = useState<'timeline' | 'buffer'>('timeline');

    const realTodayStr = getTodayDateStr();
    const currentDateStr = selectedDate || realTodayStr;
    const isToday = currentDateStr === realTodayStr;

    useEffect(() => {
        setIsMounted(true);
        loadServerTasks(currentDateStr);
    }, [currentDateStr, loadServerTasks]);

    if (!isMounted) return null;

    const currentTaskIds = schedules[currentDateStr]?.tasks || [];
    const currentTasks = currentTaskIds.map(id => tasks[id]).filter(Boolean);
    const unassignedTasks = currentTasks.filter(t => !t.timeBlockId);
    const scheduledTasks = currentTasks.filter(t => !!t.timeBlockId);
    const completedCount = currentTasks.filter(t => t.status === 'done').length;

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

        moveTask(draggableId, currentDateStr, newTimeBlockId);
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        addTask(newTaskTitle.trim(), currentDateStr);
        setNewTaskTitle('');
    };

    const navigateDay = (offset: number) => {
        const [year, month, day] = currentDateStr.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        d.setDate(d.getDate() + offset);
        setSelectedDate(formatDateStr(d));
    };

    const formattedDate = new Date(currentDateStr + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="w-full max-w-[1400px] mx-auto min-h-[85vh] pt-24 pb-12 px-4 sm:px-6 font-mono text-white">
            {/* View Selector Header */}
            <PlannerNavHeader />

            {/* Date Control Deck & Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 bg-surface-deep/90 border border-primary/20 cyber-clip backdrop-blur-md">
                {/* Date Controls */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => navigateDay(-1)}
                        className="p-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary cyber-clip-button cursor-pointer transition-colors"
                        title="Previous Day"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-primary/40 cyber-clip-button">
                        <span className="text-sm font-bold text-white uppercase tracking-wider">
                            {formattedDate}
                        </span>
                        {isToday && (
                            <span className="text-[10px] bg-primary text-black font-bold px-1.5 py-0.2 cyber-clip-button">
                                TODAY
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => navigateDay(1)}
                        className="p-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary cyber-clip-button cursor-pointer transition-colors"
                        title="Next Day"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {!isToday && (
                        <button
                            type="button"
                            onClick={() => setSelectedDate(realTodayStr)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/15 hover:bg-primary text-primary hover:text-black border border-primary/40 cyber-clip-button text-xs transition-colors cursor-pointer ml-2"
                        >
                            <RotateCcw className="w-3 h-3" />
                            <span>JUMP_TODAY</span>
                        </button>
                    )}
                </div>

                {/* Progress & Metrics */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-primary/80 bg-primary/10 border border-primary/30 px-3 py-1.5 cyber-clip-button">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>SCHEDULED: {scheduledTasks.length} HRS</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 cyber-clip-button">
                        <Activity className="w-3.5 h-3.5 animate-cyber-pulse-slow" />
                        <span>DONE: {completedCount}/{currentTasks.length}</span>
                    </div>
                </div>
            </div>

            {/* Mobile View Switcher */}
            <div className="flex lg:hidden mb-4 border border-primary/30 cyber-clip p-1 bg-surface-deep">
                <button
                    type="button"
                    onClick={() => setMobileTab('timeline')}
                    className={cn(
                        "flex-1 py-2 text-xs uppercase tracking-wider font-bold cyber-clip-button transition-all",
                        mobileTab === 'timeline' ? "bg-primary text-black" : "text-primary/70"
                    )}
                >
                    Timeline ({scheduledTasks.length})
                </button>
                <button
                    type="button"
                    onClick={() => setMobileTab('buffer')}
                    className={cn(
                        "flex-1 py-2 text-xs uppercase tracking-wider font-bold cyber-clip-button transition-all",
                        mobileTab === 'buffer' ? "bg-primary text-black" : "text-primary/70"
                    )}
                >
                    Task Buffer ({unassignedTasks.length})
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-col lg:flex-row gap-6 min-h-[75vh]">

                    {/* Left Column: Timeline Control Deck */}
                    <div className={cn(
                        "flex-[2] flex flex-col",
                        mobileTab === 'buffer' ? "hidden lg:flex" : "flex"
                    )}>
                        <Card className="flex-1 flex flex-col p-5 sm:p-6 relative overflow-hidden border-primary/30">
                            <div className="flex items-center justify-between border-b border-primary/20 pb-3 mb-4">
                                <div className="space-y-0.5">
                                    <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <LayoutGrid className="w-4 h-4 text-primary" />
                                        SCHEDULE MATRIX
                                    </h3>
                                    <p className="text-[10px] text-primary/60 uppercase">
                                        // Drag items into hourly slots or click + to add directly
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[70vh]">
                                <TimeTimeline />
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Task Queue Buffer */}
                    <div className={cn(
                        "flex-1 flex flex-col",
                        mobileTab === 'timeline' ? "hidden lg:flex" : "flex"
                    )}>
                        <Card className="flex-1 flex flex-col p-5 sm:p-6 relative overflow-hidden border-primary/30">
                            <div className="flex items-center justify-between border-b border-primary/20 pb-3 mb-4">
                                <div className="space-y-0.5">
                                    <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-primary" />
                                        TASK BUFFER ({unassignedTasks.length})
                                    </h3>
                                    <p className="text-[10px] text-primary/60 uppercase">
                                        // Unallocated tasks for {isToday ? 'Today' : formattedDate}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Add Task Input */}
                            <form onSubmit={handleAddTask} className="mb-4 relative">
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="Add task to buffer..."
                                    className="w-full bg-surface-deep/95 border border-primary/30 cyber-clip-button px-3.5 py-2 text-xs font-mono text-white placeholder:text-primary/40 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all pr-10"
                                />
                                <button
                                    type="submit"
                                    disabled={!newTaskTitle.trim()}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 cyber-clip-button bg-primary/20 hover:bg-primary text-primary hover:text-black border border-primary/40 disabled:opacity-30 transition-all cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </form>

                            {/* Droppable Task Buffer */}
                            <Droppable droppableId="unassigned-tasks">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={cn(
                                            "flex-1 overflow-y-auto custom-scrollbar min-h-[160px] cyber-clip transition-all p-2 max-h-[60vh]",
                                            snapshot.isDraggingOver ? "bg-primary/10 border border-primary/50 shadow-[0_0_20px_rgba(0,240,255,0.2)]" : ""
                                        )}
                                    >
                                        {unassignedTasks.map((task, index) => (
                                            <TaskItem key={task.id} task={task} index={index} />
                                        ))}
                                        {provided.placeholder}

                                        {unassignedTasks.length === 0 && !snapshot.isDraggingOver && (
                                            <div className="h-44 flex flex-col items-center justify-center text-primary/40 gap-2 border border-dashed border-primary/20 cyber-clip p-4 text-center">
                                                <CheckCircle2 className="w-6 h-6 text-primary/60" />
                                                <p className="text-[10px] uppercase tracking-widest text-primary/60">
                                                    [ BUFFER IS EMPTY ]
                                                </p>
                                                <p className="text-[9px] text-slate-400 max-w-[200px]">
                                                    All tasks scheduled or done. Type above to add more.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </Card>
                    </div>

                </div>
            </DragDropContext>
        </div>
    );
};
