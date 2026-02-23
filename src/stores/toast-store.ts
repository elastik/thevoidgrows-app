import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  dismissToast: (id: string) => void;
}

let nextId = 0;

const MAX_TOASTS = 3;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast(type: ToastType, message: string, duration = 3000): void {
    const id = String(++nextId);
    const toast: Toast = { id, type, message, duration };

    set((state) => {
      const updated = [...state.toasts, toast];
      // Keep only the most recent MAX_TOASTS
      return { toasts: updated.slice(-MAX_TOASTS) };
    });

    // Auto-dismiss after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  dismissToast(id: string): void {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
