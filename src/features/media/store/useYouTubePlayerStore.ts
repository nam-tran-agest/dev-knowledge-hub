import { create } from 'zustand';
import type { SavedVideo } from '@/features/media/types';
import { updateVideoProgress } from '@/features/media/services/youtube';

interface YouTubePlayerState {
    activeVideo: SavedVideo | null;
    isModalOpen: boolean;
    isPip: boolean;
    currentTime: number;

    // Actions
    playVideo: (video: SavedVideo, startInModal?: boolean) => void;
    openModal: () => void;
    closeModal: () => void;
    setPip: (isPip: boolean) => void;
    togglePip: () => void;
    closePlayer: () => void;
    setCurrentTime: (time: number) => void;
    saveProgress: () => Promise<void>;
}

export const useYouTubePlayerStore = create<YouTubePlayerState>((set, get) => ({
    activeVideo: null,
    isModalOpen: false,
    isPip: false,
    currentTime: 0,

    playVideo: (video, startInModal = true) => {
        set({
            activeVideo: video,
            isModalOpen: startInModal,
            isPip: !startInModal,
            currentTime: video.saved_time || 0,
        });
    },

    openModal: () => {
        set({ isModalOpen: true, isPip: false });
    },

    closeModal: () => {
        // When closing modal, transition smoothly to floating PiP so playback continues!
        set({ isModalOpen: false, isPip: true });
    },

    setPip: (isPip: boolean) => {
        set({ isPip, isModalOpen: !isPip && get().isModalOpen });
    },

    togglePip: () => {
        const currentPip = get().isPip;
        set({ isPip: !currentPip, isModalOpen: currentPip });
    },

    closePlayer: () => {
        const state = get();
        if (state.activeVideo && state.currentTime > 0) {
            // Save progress in background on close
            updateVideoProgress(state.activeVideo.id, state.currentTime).catch((e: unknown) => {
                console.error('Failed to auto-save video progress:', e);
            });
        }
        set({
            activeVideo: null,
            isModalOpen: false,
            isPip: false,
            currentTime: 0,
        });
    },

    setCurrentTime: (time: number) => {
        set({ currentTime: time });
    },

    saveProgress: async () => {
        const state = get();
        if (!state.activeVideo) return;
        try {
            await updateVideoProgress(state.activeVideo.id, state.currentTime);
        } catch (e: unknown) {
            console.error('Failed to save video progress:', e);
        }
    },
}));
