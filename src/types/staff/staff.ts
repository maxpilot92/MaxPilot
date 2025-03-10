import { Staff } from "@prisma/client";

// Type for gender
type GenderStatus = "Male" | "Female";

// Type for role
export type RoleStatus =
  | "Carer"
  | "Admin"
  | "Coordinator"
  | "HR"
  | "OfficeSupport"
  | "Ops"
  | "Kiosk"
  | "Others";

// Type for Employment status
export type EmploymentTypeStatus =
  | "FullTime"
  | "PartTime"
  | "Casual"
  | "Contractor"
  | "Others";

export type MaritalStatus =
  | "Single"
  | "Married"
  | "Divorced"
  | "Widowed"
  | "Separated";

// Combined input interface to match incoming data
export interface StaffInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dob: string;
  emergencyContact: string;
  language?: string;
  nationality?: string;
  gender?: GenderStatus;
  worksAt: string;
  hiredOn: string;
  role: RoleStatus;
  employmentType: EmploymentTypeStatus;
  team: string;
}

export interface PersonalDetails {
  address: string;
  dob: string; // or use `Date` if you plan to convert it to a Date object
  email: string;
  emergencyContact: string;
  fullName: string;
  gender?: string;
  id: string;
  language?: string;
  nationality?: string;
  unit?: string;
  maritalStatus?: MaritalStatus;
  religion?: string;
  staff: Staff;
  phoneNumber: string;
}

export interface WorkDetails {
  employmentType: string;
  hiredOn: string; // or use `Date` if you plan to convert it to a Date object
  id: string;
  role: string;
  teams?: string[]; // Assuming `teams` is an array of strings
  worksAt: string;
}

export interface StaffData {
  createdAt: string; // or use `Date` if you plan to convert it to a Date object
  id: string;
  role: string;
  personalDetails: PersonalDetails;
  personalDetailsId: string;
  updatedAt: string; // or use `Date` if you plan to convert it to a Date object
  workDetails: WorkDetails;
  workDetailsId: string;
  archived: boolean;
}

export interface NextOfKin {
  name: string;
  email: string;
  relation: string;
  contact: string;
  staffId: string;
  id: string;
}

export interface PayrollSettings {
  industryAward?: string;
  awardLevel?: string;
  awardLevelPay?: string;
  payGroup?: string;
  payGroupReviewDate?: string;
  employeeProfile?: string;
  allowances?: string;
  dailyHours?: number;
  weeklyHours?: number;
  externalSystemIdentifier?: string;
}

export interface Team {
  id: string;
  name: string;
  workDetails: WorkDetails;
}
