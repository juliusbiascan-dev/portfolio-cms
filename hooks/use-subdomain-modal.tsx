import { create } from 'zustand';

interface useSubdomainModalPage {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSubdomainModal = create<useSubdomainModalPage>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
