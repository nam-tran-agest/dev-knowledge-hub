/**
 * Generic validation builder for consistent validation across the app
 */

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: unknown) => string | undefined
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  fieldErrors?: Record<string, string>
}

/**
 * Generic validator builder
 */
export function createValidator(schema: ValidationSchema) {
  return (data: Record<string, unknown>): ValidationResult => {
    const errors: string[] = []
    const fieldErrors: Record<string, string> = {}

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field]
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1)

      // Required check
      if (rules.required && (!value || (typeof value === 'string' && value.trim().length === 0))) {
        const error = `${fieldName} is required`
        errors.push(error)
        fieldErrors[field] = error
        continue
      }

      // Skip other validations if field is empty and not required
      if (!value) continue

      // Type guard for string values
      const stringValue = typeof value === 'string' ? value : String(value)

      // Min length check
      if (rules.minLength && stringValue.length < rules.minLength) {
        const error = `${fieldName} must be at least ${rules.minLength} characters`
        errors.push(error)
        fieldErrors[field] = error
      }

      // Max length check
      if (rules.maxLength && stringValue.length > rules.maxLength) {
        const error = `${fieldName} must be less than ${rules.maxLength} characters`
        errors.push(error)
        fieldErrors[field] = error
      }

      // Pattern check
      if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        const error = `${fieldName} format is invalid`
        errors.push(error)
        fieldErrors[field] = error
      }

      // Custom validation
      if (rules.custom) {
        const customError = rules.custom(value)
        if (customError) {
          errors.push(customError)
          fieldErrors[field] = customError
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
    }
  }
}

/**
 * Pre-defined validators for common entities
 */
export const validators = {
  note: createValidator({
    title: { required: true, maxLength: 255 },
    content: { maxLength: 100000 }
  }),

  snippet: createValidator({
    title: { required: true, maxLength: 255 },
    content: { required: true, maxLength: 50000 },
    language: { maxLength: 50 }
  }),

  task: createValidator({
    title: { required: true, maxLength: 255 },
    description: { maxLength: 10000 }
  }),

  bug: createValidator({
    title: { required: true, maxLength: 255 },
    error_message: { maxLength: 10000 },
    stack_trace: { maxLength: 20000 }
  }),

  category: createValidator({
    name: { required: true, maxLength: 100 }
  }),

  tag: createValidator({
    name: {
      required: true,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9\s\-_]+$/,
      custom: (value) => {
        if (typeof value === 'string' && !/^[a-zA-Z0-9\s\-_]+$/.test(value)) {
          return 'Tag name can only contain letters, numbers, spaces, hyphens, and underscores'
        }
      }
    }
  }),

  email: createValidator({
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value) => {
        if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address'
        }
      }
    }
  })
}

/**
 * Legacy validators for backward compatibility
 */
export function validateEmail(email: string): ValidationResult {
  return validators.email({ email })
}

export function validateNote(title: string, content?: string): ValidationResult {
  return validators.note({ title, content })
}

export function validateSnippet(title: string, content: string, language?: string): ValidationResult {
  return validators.snippet({ title, content, language })
}

export function validateTask(title: string, description?: string): ValidationResult {
  return validators.task({ title, description })
}

export function validateBug(title: string): ValidationResult {
  return validators.bug({ title })
}

export function validateCategoryName(name: string): ValidationResult {
  return validators.category({ name })
}

export function validateTagName(name: string): ValidationResult {
  return validators.tag({ name })
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
