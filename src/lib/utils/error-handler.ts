/**
 * Centralized error handling utilities
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Bạn cần đăng nhập để thực hiện thao tác này',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  SERVER_ERROR: 'Đã xảy ra lỗi, vui lòng thử lại',
  NETWORK_ERROR: 'Lỗi kết nối, vui lòng kiểm tra mạng',
  CREATE_FAILED: 'Tạo mới thất bại',
  UPDATE_FAILED: 'Cập nhật thất bại',
  DELETE_FAILED: 'Xóa thất bại',
} as const

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return ERROR_MESSAGES.SERVER_ERROR
}

/**
 * Handle async errors with proper logging
 */
export async function handleAsyncError<T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<{ data?: T; error?: string }> {
  try {
    const data = await fn()
    return { data }
  } catch (error) {
    console.error('Error:', error)
    return { error: errorMessage || formatErrorMessage(error) }
  }
}

/**
 * Log error to console (can be extended to send to monitoring service)
 */
export function logError(error: unknown, context?: Record<string, unknown>) {
  console.error('Error occurred:', {
    error: formatErrorMessage(error),
    context,
    timestamp: new Date().toISOString(),
  })
}
