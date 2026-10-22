import { isHTTPError, isNetworkError, isTimeoutError } from "ky"

/** Stable error codes from the API contract (§1.4), plus client-side NETWORK_ERROR. */
export type ApiErrorCode =
  | "VALIDATION_FAILED"
  | "UNAUTHENTICATED"
  | "INVALID_CREDENTIALS"
  | "REFRESH_INVALID"
  | "FORBIDDEN"
  | "FORBIDDEN_ORIGIN"
  | "NOT_FOUND"
  | "EMAIL_TAKEN"
  | "INVALID_STATE_TRANSITION"
  | "AI_BUDGET_REACHED"
  | "UPLOAD_NOT_READY"
  | "UPLOAD_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "SCHEDULE_IN_PAST"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL"
  | "NETWORK_ERROR"

export interface FieldError {
  field: string
  message: string
}

/** The error body every non-2xx API response carries. */
export interface ApiErrorBody {
  statusCode: number
  code: ApiErrorCode
  message: string
  details?: FieldError[]
  path: string
  timestamp: string
}

/** The single error type thrown by every request function. `status` is 0 for network failures. */
export class ApiError extends Error {
  readonly status: number
  readonly code: ApiErrorCode
  readonly details: FieldError[]

  constructor(status: number, code: ApiErrorCode, message: string, details: FieldError[] = []) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
    this.details = details
  }

  /** 4xx errors are the caller's fault and are never retried. */
  get isClientError() {
    return this.status >= 400 && this.status < 500
  }
}

function isErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === "object" && value !== null && "code" in value && "message" in value
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (isHTTPError(error)) {
    const status = error.response.status
    return isErrorBody(error.data)
      ? new ApiError(status, error.data.code, error.data.message, error.data.details)
      : new ApiError(status, status >= 500 ? "INTERNAL" : "VALIDATION_FAILED", error.message)
  }
  if (isNetworkError(error) || isTimeoutError(error)) {
    return new ApiError(0, "NETWORK_ERROR", "Can’t reach the server. Check your connection and try again.")
  }
  return new ApiError(0, "INTERNAL", error instanceof Error ? error.message : "Something went wrong")
}

const friendly: Partial<Record<ApiErrorCode, string>> = {
  INVALID_CREDENTIALS: "Email or password is incorrect.",
  EMAIL_TAKEN: "An account with this email already exists.",
  FORBIDDEN: "Your role doesn’t allow this action.",
  NOT_FOUND: "This item no longer exists.",
  INVALID_STATE_TRANSITION: "This item was already changed. Refresh to see its current state.",
  AI_BUDGET_REACHED: "AI budget reached — raise the cap to keep drafting.",
  UPLOAD_NOT_READY: "The upload hasn’t finished yet.",
  UPLOAD_TOO_LARGE: "The file is too large.",
  UNSUPPORTED_MEDIA_TYPE: "This file type isn’t supported.",
  SCHEDULE_IN_PAST: "You can’t schedule in the past.",
  SERVICE_UNAVAILABLE: "The service is temporarily unavailable.",
  NETWORK_ERROR: "Can’t reach the server. Check your connection and try again.",
  INTERNAL: "Something went wrong on our side. Try again.",
}

/** A short, user-facing message for any error. */
export function errorMessage(error: unknown): string {
  const apiError = toApiError(error)
  if (apiError.code === "VALIDATION_FAILED") return apiError.details[0]?.message ?? apiError.message
  return friendly[apiError.code] ?? apiError.message
}
