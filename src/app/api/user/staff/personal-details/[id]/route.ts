import { ApiError, ApiErrors } from '@/app/utils/ApiError';
import { ApiSuccess, HTTP_STATUS } from '@/app/utils/ApiSuccess';
import prisma from '@/lib/prisma';
import { validateRequiredFields } from '../route';

// GET single record
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const personalDetails = await prisma.personalDetails.findUnique({
      where: { id: params.id },
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
  } catch (error: unknown) {
    console.error('Error in GET personal details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

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

// PUT update record
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    validateRequiredFields(data);

    const updatedPersonalDetails = await prisma.personalDetails.update({
      where: { id: params.id },
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
    console.error('Error in PUT personal details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    if (error instanceof ApiErrors) {
      return ApiError(error);
    }
    
    if (error && typeof error === 'object' && 'code' in error) {
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

// DELETE record
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const deletedPersonalDetails = await prisma.personalDetails.delete({
//       where: { id: params.id },
//     });

//     return ApiSuccess(
//       deletedPersonalDetails,
//       'Personal details deleted successfully'
//     );
//   } catch (error: unknown) {
//     console.error('Error in DELETE personal details:', {
//       name: error instanceof Error ? error.name : 'Unknown',
//       message: error instanceof Error ? error.message : 'Unknown error',
//       stack: error instanceof Error ? error.stack : undefined
//     });

//     if (error instanceof ApiErrors) {
//       return ApiError(error);
//     }

//     if (error && typeof error === 'object' && 'code' in error) {
//       if (error.code === 'P2025') {
//         return ApiError(
//           new ApiErrors(
//             HTTP_STATUS.NOT_FOUND,
//             'Personal details not found'
//           )
//         );
//       }
//     }

//     return ApiError(
//       new ApiErrors(
//         HTTP_STATUS.BAD_REQUEST,
//         'Error deleting personal details'
//       )
//     );
//   }
// }