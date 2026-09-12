import { create } from "zustand";

interface StopPanelState {
  openItemId: string | null;
  open: (itemId: string) => void;
  close: () => void;
}

export const useStopPanelStore = create<StopPanelState>((set) => ({
  openItemId: null,
  open: (itemId) => set({ openItemId: itemId }),
  close: () => set({ openItemId: null }),
}));
