'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to home since auth is disabled
        router.push('/')
    }, [router])

    return null
}
