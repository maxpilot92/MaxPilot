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
  staffId: string;
  staffName: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  status: ShiftStatus;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  hours: number;
  avatar?: string;
}
