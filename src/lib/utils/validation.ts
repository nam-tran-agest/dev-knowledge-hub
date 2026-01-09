/**
 * Validation utility functions
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []
  
  if (!email) {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate note input
 */
export function validateNote(title: string, content?: string): ValidationResult {
  const errors: string[] = []
  
  if (!title || title.trim().length === 0) {
    errors.push('Title is required')
  } else if (title.length > 255) {
    errors.push('Title must be less than 255 characters')
  }
  
  if (content && content.length > 100000) {
    errors.push('Content is too long (max 100,000 characters)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate snippet input
 */
export function validateSnippet(title: string, content: string, language?: string): ValidationResult {
  const errors: string[] = []
  
  if (!title || title.trim().length === 0) {
    errors.push('Title is required')
  } else if (title.length > 255) {
    errors.push('Title must be less than 255 characters')
  }
  
  if (!content || content.trim().length === 0) {
    errors.push('Content is required')
  } else if (content.length > 50000) {
    errors.push('Content is too long (max 50,000 characters)')
  }
  
  if (language && language.length > 50) {
    errors.push('Language name is too long')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate task input
 */
export function validateTask(title: string, description?: string): ValidationResult {
  const errors: string[] = []
  
  if (!title || title.trim().length === 0) {
    errors.push('Task title is required')
  } else if (title.length > 255) {
    errors.push('Title must be less than 255 characters')
  }
  
  if (description && description.length > 10000) {
    errors.push('Description is too long (max 10,000 characters)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate bug input
 */
export function validateBug(title: string): ValidationResult {
  const errors: string[] = []
  
  if (!title || title.trim().length === 0) {
    errors.push('Bug title is required')
  } else if (title.length > 255) {
    errors.push('Title must be less than 255 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate category name
 */
export function validateCategoryName(name: string): ValidationResult {
  const errors: string[] = []
  
  if (!name || name.trim().length === 0) {
    errors.push('Category name is required')
  } else if (name.length > 100) {
    errors.push('Category name must be less than 100 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate tag name
 */
export function validateTagName(name: string): ValidationResult {
  const errors: string[] = []
  
  if (!name || name.trim().length === 0) {
    errors.push('Tag name is required')
  } else if (name.length > 50) {
    errors.push('Tag name must be less than 50 characters')
  } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
    errors.push('Tag name can only contain letters, numbers, spaces, hyphens, and underscores')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate hex color
 */
export function validateColor(color: string): ValidationResult {
  const errors: string[] = []
  
  if (!color) {
    errors.push('Color is required')
  } else if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    errors.push('Please enter a valid hex color (e.g., #6366f1)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > characters
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
