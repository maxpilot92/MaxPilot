export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PersonalDetails {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dob: string;
  emergencyContact: string;
  language?: string;
  nationality?: string;
  gender?: "Male" | "Female";
}

export interface Staff {
  id: string;
  personalDetails: {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dob: string;
    emergencyContact: string;
    language?: string;
    nationality?: string;
    gender?: "Male" | "Female";
  };
  role: string;
  employmentType: string;
  team: string;
}

export interface StaffResponse {
  success: boolean;
  status: number;
  data: {
    data: Staff[];
    pagination: Pagination;
  };
  message: string;
}

export interface FilterParams {
  role?: string;
  employmentType?: string;
  team?: string;
  gender?: "Male" | "Female";
  page?: number;
  limit?: number;
}
