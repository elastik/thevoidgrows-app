import { useToastStore } from '@/stores/toast-store.ts';
import type { ToastType } from '@/stores/toast-store.ts';

function toastColor(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'border-bio-cyan text-bio-cyan';
    case 'error':
      return 'border-neon-magenta text-neon-magenta';
    case 'info':
      return 'border-harvest-gold text-harvest-gold';
  }
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-10 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismissToast(toast.id)}
          className={`pointer-events-auto animate-[slideIn_0.2s_ease-out] rounded-lg border bg-void-black/95 px-4 py-2.5 text-sm shadow-lg backdrop-blur-sm ${toastColor(toast.type)}`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
