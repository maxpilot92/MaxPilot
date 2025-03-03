import { create } from "zustand";

interface AdminStore {
  adminId: string;
  setAdminId: (adminId: string) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  adminId: "7229b2e2-5a38-4af7-aaf5-2d6b2a10b093",
  setAdminId: (adminId) => set({ adminId }),
}));
