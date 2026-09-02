'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message || 'Invalid email or password' }
    }

    const nextUrl = (formData.get('next') as string) || '/'
    const safeNext = (nextUrl.startsWith('/') && !nextUrl.startsWith('//')) ? nextUrl : '/'

    revalidatePath('/', 'layout')
    redirect(safeNext)
}

export async function signup(formData: FormData, origin?: string) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const redirectUrl = origin ? `${origin}/callback?next=/` : undefined

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: redirectUrl,
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
        return { error: 'An account with this email already exists.' }
    }

    if (data.session) {
        revalidatePath('/', 'layout')
        redirect('/')
    }

    return { 
        success: true, 
        message: 'Confirmation link sent to your email. Please verify to access your workspace.' 
    }
}

export async function forgotPassword(formData: FormData, origin?: string) {
    const supabase = await createClient()

    const email = formData.get('email') as string

    if (!email) {
        return { error: 'Email is required' }
    }

    const redirectUrl = origin ? `${origin}/callback?next=/reset-password` : undefined

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
    })

    if (error) {
        return { error: error.message }
    }

    return { 
        success: true, 
        message: 'Password recovery link sent to your email.' 
    }
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()

    const displayName = (formData.get('displayName') as string)?.trim()
    const password = formData.get('password') as string

    if (!password || password.length < 6) {
        return { error: 'Password must be at least 6 characters' }
    }

    const updatePayload: {
        password: string
        data?: { full_name?: string; name?: string }
    } = {
        password,
    }

    if (displayName) {
        updatePayload.data = {
            full_name: displayName,
            name: displayName,
        }
    }

    const { error } = await supabase.auth.updateUser(updatePayload)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized: User is not authenticated' }
    }

    const displayName = (formData.get('displayName') as string)?.trim()
    const password = (formData.get('password') as string)?.trim()

    const updatePayload: {
        password?: string
        data?: { full_name?: string; name?: string }
    } = {}

    if (displayName) {
        updatePayload.data = {
            full_name: displayName,
            name: displayName,
        }
    }

    if (password) {
        if (password.length < 6) {
            return { error: 'New password must be at least 6 characters' }
        }
        updatePayload.password = password
    }

    if (!updatePayload.password && !updatePayload.data) {
        return { error: 'No parameter updates provided' }
    }

    const { error } = await supabase.auth.updateUser(updatePayload)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function getCurrentUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}
