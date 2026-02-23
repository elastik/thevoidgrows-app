import { useToastStore } from '@/stores/toast-store.ts';

/** Hook for adding and dismissing toast notifications */
export function useToast() {
  const addToast = useToastStore((s) => s.addToast);
  const dismissToast = useToastStore((s) => s.dismissToast);
  return { addToast, dismissToast } as const;
}
