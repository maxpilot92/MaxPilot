import { create } from "zustand";

interface OnBoardingState {
  companyId: string;
  companyName: string;
  email: string;
  fullName: string;
  managerEmail: string;
  accountType: string;
  role: string;
  subRoles: string;
}

interface OnBoardingStore {
  onBoardingStates: OnBoardingState;
  setOnBoardingStates: (state: Partial<OnBoardingState>) => void;
}

export const useOnBoardingStore = create<OnBoardingStore>((set) => ({
  onBoardingStates: {
    companyId: "",
    companyName: "",
    email: "",
    fullName: "",
    managerEmail: "",
    accountType: "",
    role: "",
    subRoles: "",
  },
  setOnBoardingStates: (newState) =>
    set((state) => ({
      onBoardingStates: { ...state.onBoardingStates, ...newState },
    })),
}));
