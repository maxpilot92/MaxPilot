export enum ShiftStatus {
  CREATED = "CREATED",
  PUBLISHED = "PUBLISHED",
  APPROVED = "APPROVED",
  CANCELLED = "CANCELLED",
  ON_LEAVE = "ON_LEAVE",
  INVOICED = "INVOICED",
}

export interface Shift {
  id: string;
  carerId: string;
  carerName?: string;
  clientId?: string;
  clientName?: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceType?: string;
  status: ShiftStatus;
  payGroup?: string;
  priceBook?: string;
  funds?: string;
  shiftType?: string;
  additionalShiftType?: string;
  allowance?: string;
  shiftFinishesNextDay?: boolean;
  repeat?: boolean;
  address?: string;
  unitNumber?: string;
  instructions?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  hours: number;
  avatar?: string;
}
