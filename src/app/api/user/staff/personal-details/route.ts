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

function validateRequiredFields(data: PersonalDetailsInput): void {
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
  } catch (error) {
    if (error instanceof ApiErrors) {
      return ApiError(error);
    }
    return ApiError(
      new ApiErrors(
        HTTP_STATUS.BAD_REQUEST,
        'Error creating personal details'
      )
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ApiErrors(
        HTTP_STATUS.BAD_REQUEST,
        'ID is required'
      );
    }

    const personalDetails = await prisma.personalDetails.findUnique({
      where: { id },
    });

    if (!personalDetails) {
      throw new ApiErrors(
        HTTP_STATUS.NOT_FOUND,
        'Personal details not found'
      );
    }

    return ApiSuccess(
      personalDetails,
      'Personal details retrieved successfully'
    );
  } catch (error) {
    if (error instanceof ApiErrors) {
      return ApiError(error);
    }
    return ApiError(
      new ApiErrors(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Error fetching personal details'
      )
    );
  }
}

export async function PUT(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
  
      if (!id) {
        throw new ApiErrors(
          HTTP_STATUS.BAD_REQUEST,
          'ID is required'
        );
      }
  
      const data = await request.json();
      validateRequiredFields(data);
  
      const updatedPersonalDetails = await prisma.personalDetails.update({
        where: { id },
        data: {
          ...data,
          dob: new Date(data.dob),
        },
      });
  
      return ApiSuccess(
        updatedPersonalDetails,
        'Personal details updated successfully'
      );
    } catch (error: unknown) {
      if (error instanceof ApiErrors) {
        return ApiError(error);
      }
      
      // Type guard for Prisma error
      if (error && typeof error === 'object' && 'code' in error) {
        // Handle Prisma's record not found error
        if (error.code === 'P2025') {
          return ApiError(
            new ApiErrors(
              HTTP_STATUS.NOT_FOUND,
              'Personal details not found'
            )
          );
        }
      }
  
      return ApiError(
        new ApiErrors(
          HTTP_STATUS.BAD_REQUEST,
          'Error updating personal details'
        )
      );
    }
  }

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ApiErrors(
        HTTP_STATUS.BAD_REQUEST,
        'ID is required'
      );
    }

    const deletedPersonalDetails = await prisma.personalDetails.delete({
      where: { id },
    });

    return ApiSuccess(
      deletedPersonalDetails,
      'Personal details deleted successfully'
    );
  } catch (error: unknown) {
    if (error instanceof ApiErrors) {
      return ApiError(error);
    }
    
    // Type guard for Prisma error
    if (error && typeof error === 'object' && 'code' in error) {
      // Handle Prisma's record not found error
      if (error.code === 'P2025') {
        return ApiError(
          new ApiErrors(
            HTTP_STATUS.NOT_FOUND,
            'Personal details not found'
          )
        );
      }
    }

    return ApiError(
      new ApiErrors(
        HTTP_STATUS.BAD_REQUEST,
        'Error deleting personal details'
      )
    );
  }
}