import { ApiError, ApiErrors } from '@/app/utils/ApiError';
import { ApiSuccess, HTTP_STATUS } from '@/app/utils/ApiSuccess';
import  prisma  from '@/lib/prisma';


interface PersonalDetailsInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dob: string;
  emergencyContact: string;
  language?: string;
  nationality?: string;
  gender?: string;
}

export function validateRequiredFields(data: PersonalDetailsInput): void {
  const requiredFields = ['fullName', 'email', 'phoneNumber', 'dob', 'address', 'emergencyContact'];
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!data[field as keyof PersonalDetailsInput]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    throw new ApiErrors(
      HTTP_STATUS.BAD_REQUEST,
      'Required fields missing',
      { fields: missingFields }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    validateRequiredFields(data);

    const personalDetails = await prisma.personalDetails.create({
      data: {
        ...data,
        dob: new Date(data.dob),
      },
    });

    return ApiSuccess(
      personalDetails,
      'Personal details created successfully',
      HTTP_STATUS.CREATED
    );
  } catch (error: unknown) {    
    // Log the detailed error
    console.error('Error in POST personal details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    if (error instanceof ApiErrors) {
      return ApiError(error);
    }

    // If it's a Prisma error
    if (error && typeof error === 'object' && 'code' in error) {
      return ApiError(
        new ApiErrors(
          HTTP_STATUS.BAD_REQUEST,
          'Database error occurred'
        )
      );
    }

    return ApiError(
      new ApiErrors(
        HTTP_STATUS.BAD_REQUEST,
        'Error creating personal details'
      )
    );
  }
}

