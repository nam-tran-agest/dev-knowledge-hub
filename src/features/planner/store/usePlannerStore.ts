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

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface PlannerTask {
    id: string;
    title: string;
    status: TaskStatus;
    createdAt: string; // ISO date string
    timeBlockId?: string; // If assigned to a specific time block
}

export interface DaySchedule {
    date: string; // ISO date string
    tasks: string[]; // Task IDs
}

interface PlannerState {
    tasks: Record<string, PlannerTask>;
    schedules: Record<string, DaySchedule>; // date -> DaySchedule
    isSyncing: boolean;

    // Server Sync
    loadServerTasks: (date: string) => Promise<void>;

    // Actions
    addTask: (title: string, date?: string, timeBlockId?: string) => void;
    updateTaskStatus: (taskId: string, status: TaskStatus) => void;
    deleteTask: (taskId: string) => void;
    moveTask: (taskId: string, newDate?: string, newTimeBlockId?: string) => void;

    // Getters
    getTasksForDate: (date: string) => PlannerTask[];
}

export const usePlannerStore = create<PlannerState>()(
    persist(
        (set, get) => ({
            tasks: {},
            schedules: {},
            isSyncing: false,

            loadServerTasks: async (date: string) => {
                set({ isSyncing: true });
                try {
                    const serverTasks = await getPlannerTasks(date);
                    if (serverTasks && serverTasks.length > 0) {
                        const newTasks: Record<string, PlannerTask> = { ...get().tasks };
                        const taskIds: string[] = [];

                        serverTasks.forEach((dbTask: DBPlannerTask) => {
                            newTasks[dbTask.id] = {
                                id: dbTask.id,
                                title: dbTask.title,
                                status: dbTask.status,
                                createdAt: dbTask.created_at,
                                timeBlockId: dbTask.time_block_id || undefined,
                            };
                            taskIds.push(dbTask.id);
                        });

                        set((state) => ({
                            tasks: newTasks,
                            schedules: {
                                ...state.schedules,
                                [date]: {
                                    date,
                                    tasks: taskIds,
                                },
                            },
                        }));
                    }
                } catch (e) {
                    console.error('Failed to sync planner with server:', e);
                } finally {
                    set({ isSyncing: false });
                }
            },

            addTask: (title, date = new Date().toISOString().split('T')[0], timeBlockId) => {
                const tempId = uuidv4();
                const newTask: PlannerTask = {
                    id: tempId,
                    title,
                    status: 'todo',
                    createdAt: new Date().toISOString(),
                    timeBlockId,
                };

                // 1. Optimistic Local Update
                set((state) => {
                    const currentSchedule = state.schedules[date] || { date, tasks: [] };
                    return {
                        tasks: { ...state.tasks, [tempId]: newTask },
                        schedules: {
                            ...state.schedules,
                            [date]: {
                                ...currentSchedule,
                                tasks: [...currentSchedule.tasks, tempId],
                            },
                        },
                    };
                });

                // 2. Background Cloud Sync
                addPlannerTask(title, date, timeBlockId).then((saved) => {
                    if (saved && saved.id !== tempId) {
                        set((state) => {
                            const newTasks = { ...state.tasks };
                            delete newTasks[tempId];
                            newTasks[saved.id] = {
                                ...newTask,
                                id: saved.id,
                            };

                            const currentSchedule = state.schedules[date] || { date, tasks: [] };
                            const updatedTaskIds = currentSchedule.tasks.map(id => id === tempId ? saved.id : id);

                            return {
                                tasks: newTasks,
                                schedules: {
                                    ...state.schedules,
                                    [date]: {
                                        ...currentSchedule,
                                        tasks: updatedTaskIds,
                                    },
                                },
                            };
                        });
                    }
                }).catch((err) => {
                    console.error('Background add task sync failed:', err);
                });
            },

            updateTaskStatus: (taskId, status) => {
                // 1. Optimistic Local Update
                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [taskId]: { ...state.tasks[taskId], status },
                    }
                }));

                // 2. Background Cloud Sync
                updatePlannerTask(taskId, { status }).catch((err) => {
                    console.error('Background update task status failed:', err);
                });
            },

            deleteTask: (taskId) => {
                // 1. Optimistic Local Update
                set((state) => {
                    const newTasks = { ...state.tasks };
                    delete newTasks[taskId];

                    const newSchedules = { ...state.schedules };
                    Object.keys(newSchedules).forEach(date => {
                        newSchedules[date].tasks = newSchedules[date].tasks.filter(id => id !== taskId);
                    });

                    return { tasks: newTasks, schedules: newSchedules };
                });

                // 2. Background Cloud Sync
                deletePlannerTask(taskId).catch((err) => {
                    console.error('Background delete task failed:', err);
                });
            },

            moveTask: (taskId, newDate, newTimeBlockId) => {
                const task = get().tasks[taskId];
                if (!task) return;

                // 1. Optimistic Local Update
                const updatedTask = { ...task, timeBlockId: newTimeBlockId };
                const newTasks = { ...get().tasks, [taskId]: updatedTask };
                const newSchedules = { ...get().schedules };

                if (newDate) {
                    Object.entries(newSchedules).forEach(([d, sched]) => {
                        if (sched.tasks.includes(taskId)) {
                            newSchedules[d] = {
                                ...sched,
                                tasks: sched.tasks.filter(id => id !== taskId)
                            };
                        }
                    });

                    const targetSchedule = newSchedules[newDate] || { date: newDate, tasks: [] };
                    newSchedules[newDate] = {
                        ...targetSchedule,
                        tasks: [...targetSchedule.tasks, taskId]
                    };
                }

                set({ tasks: newTasks, schedules: newSchedules });

                // 2. Background Cloud Sync
                updatePlannerTask(taskId, { 
                    time_block_id: newTimeBlockId || null,
                    date: newDate 
                }).catch((err) => {
                    console.error('Background move task failed:', err);
                });
            },

            getTasksForDate: (date: string) => {
                const state = get();
                const schedule = state.schedules[date];
                if (!schedule) return [];
                return schedule.tasks.map(id => state.tasks[id]).filter(Boolean);
            }
        }),
        {
            name: 'planner-storage',
        }
    )
);
