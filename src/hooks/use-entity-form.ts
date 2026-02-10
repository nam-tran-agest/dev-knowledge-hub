/**
 * Generic form hook for entity management
 */

import { useState, useCallback } from 'react'
import { validators, type ValidationResult } from '@/lib/utils/validation'

type EntityType = 'note' | 'snippet' | 'bug' | 'task' | 'category' | 'tag'

interface UseEntityFormOptions<T> {
  entityType: EntityType
  initialData?: Partial<T>
  onSubmit: (data: T) => Promise<void>
  customValidator?: (data: Record<string, unknown>) => ValidationResult
}

interface UseEntityFormReturn<T> {
  formData: Partial<T>
  errors: string[]
  isLoading: boolean
  isValid: boolean
  setField: (field: keyof T, value: unknown) => void
  setFormData: (data: Partial<T>) => void
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  reset: () => void
  validate: () => ValidationResult
}

export function useEntityForm<T extends Record<string, unknown>>({
  entityType,
  initialData = {},
  onSubmit,
  customValidator
}: UseEntityFormOptions<T>): UseEntityFormReturn<T> {
  const [formData, setFormDataState] = useState<Partial<T>>(initialData)
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Set individual field
  const setField = useCallback((field: keyof T, value: unknown) => {
    setFormDataState(prev => ({ ...prev, [field]: value }))
    setErrors([])
  }, [])

  // Set entire form data
  const setFormData = useCallback((data: Partial<T>) => {
    setFormDataState(data)
    setErrors([])
  }, [])

  // Validate form data
  const validate = useCallback((): ValidationResult => {
    if (customValidator) {
      return customValidator(formData)
    }

    const validator = validators[entityType]
    if (!validator) {
      return { isValid: true, errors: [] }
    }

    return validator(formData as Record<string, unknown>)
  }, [formData, entityType, customValidator])

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    // Validate
    const validationResult = validate()
    if (!validationResult.isValid) {
      setErrors(validationResult.errors)
      return
    }

    // Submit
    setIsLoading(true)
    setErrors([])

    try {
      await onSubmit(formData as T)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setErrors([errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [formData, validate, onSubmit])

  // Reset form
  const reset = useCallback(() => {
    setFormDataState(initialData)
    setErrors([])
    setIsLoading(false)
  }, [initialData])

  return {
    formData,
    errors,
    isLoading,
    isValid: validate().isValid,
    setField,
    setFormData,
    handleSubmit,
    reset,
    validate
  }
}

/**
 * Preset hooks for common entity types
 */
export function useNoteForm(options: Omit<UseEntityFormOptions<Record<string, unknown>>, 'entityType'>) {
  return useEntityForm({ ...options, entityType: 'note' })
}

export function useSnippetForm(options: Omit<UseEntityFormOptions<Record<string, unknown>>, 'entityType'>) {
  return useEntityForm({ ...options, entityType: 'snippet' })
}

export function useBugForm(options: Omit<UseEntityFormOptions<Record<string, unknown>>, 'entityType'>) {
  return useEntityForm({ ...options, entityType: 'bug' })
}

export function useTaskForm(options: Omit<UseEntityFormOptions<Record<string, unknown>>, 'entityType'>) {
  return useEntityForm({ ...options, entityType: 'task' })
}

export function useCategoryForm(options: Omit<UseEntityFormOptions<Record<string, unknown>>, 'entityType'>) {
  return useEntityForm({ ...options, entityType: 'category' })
}

export function useTagForm(options: Omit<UseEntityFormOptions<Record<string, unknown>>, 'entityType'>) {
  return useEntityForm({ ...options, entityType: 'tag' })
}
