import { NextResponse } from "next/server";
import { HTTP_STATUS } from "./ApiSuccess";

export class ApiErrors extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export function ApiError(
  error: ApiErrors | Error,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
): NextResponse<ApiErrorResponse> {
  const statusCode = error instanceof ApiErrors ? error.statusCode : status;

  return NextResponse.json(
    {
      success: false,
      message: error.message,
      errors: error instanceof ApiErrors ? error.errors : undefined,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}
