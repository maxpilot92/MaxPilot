import {
  WorkDetails,
  PersonalDetails,
  PublicInformation,
} from "@prisma/client";

export interface User {
  id: string;
  role: string;
  personalDetailsId: string;
  personalDetails: PersonalDetails;
  workDetailsId?: string;
  workDetails?: WorkDetails;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  PublicInformation?: PublicInformation;
}
