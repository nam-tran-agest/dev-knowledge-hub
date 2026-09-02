import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
    getPlannerTasks, 
    addPlannerTask, 
    updatePlannerTask, 
    deletePlannerTask,
    type DBPlannerTask 
} from '@/features/planner/services/planner';
import { getTodayDateStr } from '../utils/date';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface PlannerTask {
    id: string;
    title: string;
    status: TaskStatus;
    createdAt: string; // ISO date string
    date: string; // 'YYYY-MM-DD' or 'someday'
    timeBlockId?: string; // e.g. '09:00'
}

export interface DaySchedule {
    date: string; // ISO date string
    tasks: string[]; // Task IDs
}

interface PlannerState {
    tasks: Record<string, PlannerTask>;
    schedules: Record<string, DaySchedule>; // date -> DaySchedule
    selectedDate: string; // 'YYYY-MM-DD'
    isSyncing: boolean;

    // Server Sync
    loadServerTasks: (date?: string, endDate?: string) => Promise<void>;

    // Navigation
    setSelectedDate: (date: string) => void;

    // Actions
    addTask: (title: string, date?: string, timeBlockId?: string) => void;
    editTask: (taskId: string, newTitle: string) => void;
    updateTaskStatus: (taskId: string, status: TaskStatus) => void;
    deleteTask: (taskId: string) => void;
    moveTask: (taskId: string, newDate?: string, newTimeBlockId?: string) => void;
    clearTaskTimeBlock: (taskId: string) => void;
    moveTaskToSomeday: (taskId: string) => void;

    // Realtime Sync
    handleRealtimeEvent: (eventType: 'INSERT' | 'UPDATE' | 'DELETE', payload: DBPlannerTask | { id: string }) => void;

    // Getters
    getTasksForDate: (date: string) => PlannerTask[];
    getSomedayTasks: () => PlannerTask[];
}

const syncCache = new Map<string, number>();
const SYNC_CACHE_TTL_MS = 5000; // 5s throttle to prevent request storms

export const usePlannerStore = create<PlannerState>()(
    persist(
        (set, get) => ({
            tasks: {},
            schedules: {},
            selectedDate: getTodayDateStr(),
            isSyncing: false,

            setSelectedDate: (date: string) => {
                set({ selectedDate: date });
            },

            loadServerTasks: async (date?: string, endDate?: string) => {
                const cacheKey = `${date || 'today'}_${endDate || ''}`;
                const lastSynced = syncCache.get(cacheKey);
                const now = Date.now();

                // Skip request if recently fetched within 5 seconds
                if (lastSynced && (now - lastSynced < SYNC_CACHE_TTL_MS)) {
                    return;
                }

                syncCache.set(cacheKey, now);
                set({ isSyncing: true });
                try {
                    const serverTasks = await getPlannerTasks(date, endDate);
                    if (serverTasks && serverTasks.length > 0) {
                        const newTasks: Record<string, PlannerTask> = { ...get().tasks };
                        const newSchedules: Record<string, DaySchedule> = { ...get().schedules };

                        serverTasks.forEach((dbTask: DBPlannerTask) => {
                            const taskDate = dbTask.date || 'someday';
                            newTasks[dbTask.id] = {
                                id: dbTask.id,
                                title: dbTask.title,
                                status: dbTask.status,
                                createdAt: dbTask.created_at,
                                date: taskDate,
                                timeBlockId: dbTask.time_block_id || undefined,
                            };

                            if (!newSchedules[taskDate]) {
                                newSchedules[taskDate] = { date: taskDate, tasks: [] };
                            }
                            if (!newSchedules[taskDate].tasks.includes(dbTask.id)) {
                                newSchedules[taskDate].tasks.push(dbTask.id);
                            }
                        });

                        set({ tasks: newTasks, schedules: newSchedules });
                    }
                } catch (e) {
                    console.error('Failed to sync planner with server:', e);
                } finally {
                    set({ isSyncing: false });
                }
            },

            addTask: (title, date, timeBlockId) => {
                const targetDate = date || get().selectedDate || getTodayDateStr();
                const tempId = uuidv4();
                const newTask: PlannerTask = {
                    id: tempId,
                    title,
                    status: 'todo',
                    createdAt: new Date().toISOString(),
                    date: targetDate,
                    timeBlockId,
                };

                // 1. Optimistic Local Update
                set((state) => {
                    const currentSchedule = state.schedules[targetDate] || { date: targetDate, tasks: [] };
                    return {
                        tasks: { ...state.tasks, [tempId]: newTask },
                        schedules: {
                            ...state.schedules,
                            [targetDate]: {
                                ...currentSchedule,
                                tasks: [...currentSchedule.tasks, tempId],
                            },
                        },
                    };
                });

                // 2. Background Cloud Sync
                addPlannerTask(title, targetDate, timeBlockId).then((saved) => {
                    if (saved && saved.id !== tempId) {
                        set((state) => {
                            const newTasks = { ...state.tasks };
                            delete newTasks[tempId];
                            newTasks[saved.id] = {
                                ...newTask,
                                id: saved.id,
                            };

                            const currentSchedule = state.schedules[targetDate] || { date: targetDate, tasks: [] };
                            const updatedTaskIds = currentSchedule.tasks.map(id => id === tempId ? saved.id : id);

                            return {
                                tasks: newTasks,
                                schedules: {
                                    ...state.schedules,
                                    [targetDate]: {
                                        ...currentSchedule,
                                        tasks: updatedTaskIds,
                                    },
                                },
                            };
                        });
                    }
                }).catch((err: unknown) => {
                    console.error('Background add task sync failed:', err);
                });
            },

            editTask: (taskId, newTitle) => {
                const task = get().tasks[taskId];
                if (!task || !newTitle.trim()) return;

                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [taskId]: { ...state.tasks[taskId], title: newTitle.trim() },
                    }
                }));

                updatePlannerTask(taskId, { title: newTitle.trim() }).catch((err: unknown) => {
                    console.error('Background edit task title failed:', err);
                });
            },

            updateTaskStatus: (taskId, status) => {
                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [taskId]: { ...state.tasks[taskId], status },
                    }
                }));

                updatePlannerTask(taskId, { status }).catch((err: unknown) => {
                    console.error('Background update task status failed:', err);
                });
            },

            deleteTask: (taskId) => {
                set((state) => {
                    const newTasks = { ...state.tasks };
                    delete newTasks[taskId];

                    const newSchedules = { ...state.schedules };
                    Object.keys(newSchedules).forEach(date => {
                        newSchedules[date].tasks = newSchedules[date].tasks.filter(id => id !== taskId);
                    });

                    return { tasks: newTasks, schedules: newSchedules };
                });

                deletePlannerTask(taskId).catch((err: unknown) => {
                    console.error('Background delete task failed:', err);
                });
            },

            moveTask: (taskId, newDate, newTimeBlockId) => {
                const task = get().tasks[taskId];
                if (!task) return;

                const targetDate = newDate || task.date || get().selectedDate;
                const updatedTask: PlannerTask = { 
                    ...task, 
                    date: targetDate, 
                    timeBlockId: newTimeBlockId 
                };

                const newTasks = { ...get().tasks, [taskId]: updatedTask };
                const newSchedules = { ...get().schedules };

                // Remove from all other date schedules
                Object.entries(newSchedules).forEach(([d, sched]) => {
                    if (d !== targetDate && sched.tasks.includes(taskId)) {
                        newSchedules[d] = {
                            ...sched,
                            tasks: sched.tasks.filter(id => id !== taskId)
                        };
                    }
                });

                // Add to target schedule if not already present
                const targetSchedule = newSchedules[targetDate] || { date: targetDate, tasks: [] };
                if (!targetSchedule.tasks.includes(taskId)) {
                    newSchedules[targetDate] = {
                        ...targetSchedule,
                        tasks: [...targetSchedule.tasks, taskId]
                    };
                }

                set({ tasks: newTasks, schedules: newSchedules });

                updatePlannerTask(taskId, { 
                    time_block_id: newTimeBlockId || null,
                    date: targetDate 
                }).catch((err: unknown) => {
                    console.error('Background move task failed:', err);
                });
            },

            clearTaskTimeBlock: (taskId) => {
                const task = get().tasks[taskId];
                if (!task) return;

                const updatedTask: PlannerTask = { ...task, timeBlockId: undefined };
                set((state) => ({
                    tasks: { ...state.tasks, [taskId]: updatedTask }
                }));

                updatePlannerTask(taskId, { time_block_id: null }).catch((err: unknown) => {
                    console.error('Background clear time block failed:', err);
                });
            },

            moveTaskToSomeday: (taskId) => {
                get().moveTask(taskId, 'someday', undefined);
            },

            handleRealtimeEvent: (eventType, payload) => {
                const state = get();
                if (eventType === 'DELETE') {
                    const taskId = payload.id;
                    if (!state.tasks[taskId]) return;

                    const newTasks = { ...state.tasks };
                    delete newTasks[taskId];

                    const newSchedules = { ...state.schedules };
                    Object.keys(newSchedules).forEach(d => {
                        newSchedules[d] = {
                            ...newSchedules[d],
                            tasks: newSchedules[d].tasks.filter(id => id !== taskId)
                        };
                    });

                    set({ tasks: newTasks, schedules: newSchedules });
                    return;
                }

                const dbTask = payload as DBPlannerTask;
                if (!dbTask || !dbTask.id) return;

                const convertedTask: PlannerTask = {
                    id: dbTask.id,
                    title: dbTask.title,
                    status: dbTask.status || 'todo',
                    date: dbTask.date || 'someday',
                    timeBlockId: dbTask.time_block_id || undefined,
                    createdAt: dbTask.created_at || new Date().toISOString()
                };

                const newTasks = { ...state.tasks, [convertedTask.id]: convertedTask };
                const newSchedules = { ...state.schedules };

                // Clean old schedule if exists
                Object.keys(newSchedules).forEach(d => {
                    newSchedules[d] = {
                        ...newSchedules[d],
                        tasks: newSchedules[d].tasks.filter(id => id !== convertedTask.id)
                    };
                });

                // Add to current schedule
                const targetDate = convertedTask.date;
                const existingSchedule = newSchedules[targetDate] || { date: targetDate, tasks: [] };
                newSchedules[targetDate] = {
                    ...existingSchedule,
                    tasks: [...existingSchedule.tasks, convertedTask.id]
                };

                set({ tasks: newTasks, schedules: newSchedules });
            },

            getTasksForDate: (date: string) => {
                const state = get();
                const schedule = state.schedules[date];
                if (!schedule) return [];
                return schedule.tasks.map(id => state.tasks[id]).filter(Boolean);
            },

            getSomedayTasks: () => {
                const state = get();
                const schedule = state.schedules['someday'];
                if (schedule && schedule.tasks.length > 0) {
                    return schedule.tasks.map(id => state.tasks[id]).filter(Boolean);
                }
                return Object.values(state.tasks).filter(t => t && t.date === 'someday');
            }
        }),
        {
            name: 'planner-storage',
        }
    )
);
