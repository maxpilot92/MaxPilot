import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BusinessStore {
  companyId: string;
  setCompanyId: (companyId: string) => void;
}

export const useBusinessStore = create<BusinessStore>()(
  persist(
    (set) => ({
      companyId: "",
      setCompanyId: (companyId) => set({ companyId }),
    }),
    {
      name: "business-store", // localStorage key
    }
  )
);
