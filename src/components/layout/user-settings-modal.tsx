'use client'

import React, { useState, useTransition } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/lib/actions/auth'
import { type User } from '@supabase/supabase-js'
import { 
    Loader2, 
    Shield, 
    User as UserIcon, 
    Lock, 
    ShieldCheck, 
    CheckCircle2, 
    AlertTriangle,
    KeyRound
} from 'lucide-react'

interface UserSettingsModalProps {
    user: User | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onProfileUpdated?: (newName: string) => void
}

export function UserSettingsModal({
    user,
    open,
    onOpenChange,
    onProfileUpdated
}: UserSettingsModalProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const currentDisplayName = 
        user?.user_metadata?.full_name || 
        user?.user_metadata?.name || 
        user?.email?.split('@')[0] || 
        ''

    const [displayName, setDisplayName] = useState(currentDisplayName)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    React.useEffect(() => {
        if (open) {
            setDisplayName(currentDisplayName)
            setPassword('')
            setConfirmPassword('')
            setError(null)
            setSuccessMessage(null)
        }
    }, [open, currentDisplayName])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccessMessage(null)

        if (password && password.length < 6) {
            setError('Mật khẩu mới phải có tối thiểu 6 ký tự.')
            return
        }

        if (password && password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.')
            return
        }

        if (!displayName.trim() && !password) {
            setError('Vui lòng nhập tên hiển thị mới hoặc mật khẩu mới.')
            return
        }

        startTransition(async () => {
            try {
                const formData = new FormData()
                if (displayName.trim()) {
                    formData.set('displayName', displayName.trim())
                }
                if (password) {
                    formData.set('password', password)
                }

                const result = await updateProfile(formData)

                if (result?.error) {
                    setError(result.error)
                } else if (result?.success) {
                    setSuccessMessage('Danh tính người vận hành đã được cập nhật thành công!')
                    if (onProfileUpdated && displayName.trim()) {
                        onProfileUpdated(displayName.trim())
                    }
                    setPassword('')
                    setConfirmPassword('')
                    setTimeout(() => {
                        onOpenChange(false)
                    }, 1200)
                }
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Cập nhật danh tính thất bại.'
                setError(msg)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent tag="IDENTITY_SETTINGS" className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        // OPERATOR_IDENTITY_SETTINGS
                    </DialogTitle>
                    <DialogDescription>
                        Cấu hình thông số hồ sơ người vận hành và mật mã bảo mật.
                    </DialogDescription>
                </DialogHeader>

                {/* Telemetry Info Card */}
                <div className="bg-[#030712]/90 border border-primary/25 cyber-clip-button p-3 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between items-center text-primary/70">
                        <span>// OPERATOR_EMAIL:</span>
                        <span className="text-white font-bold">{user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-primary/70">
                        <span>// CLEARANCE_LEVEL:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            OPERATOR_LV1
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {error && (
                        <div className="p-3 cyber-clip-button bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0 text-destructive mt-0.5" />
                            <div>// UPDATE_ERROR: {error}</div>
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-3 cyber-clip-button bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                            <div>// {successMessage}</div>
                        </div>
                    )}

                    {/* Display Name Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="settings-displayName" className="text-primary/80 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <UserIcon className="w-3.5 h-3.5 text-primary" />
                            Tên Hiển Thị / Call Sign
                        </Label>
                        <Input
                            id="settings-displayName"
                            value={displayName}
                            placeholder="Ví dụ: Neo, Cyber_01"
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="bg-[#030712]/90 border-primary/30 focus:border-primary text-white font-mono text-xs"
                        />
                    </div>

                    {/* Change Password Section */}
                    <div className="pt-2 border-t border-primary/15 space-y-3">
                        <div className="text-[11px] font-mono text-primary/60 uppercase tracking-widest flex items-center gap-1.5">
                            <KeyRound className="w-3.5 h-3.5 text-primary" />
                            // ĐỔI MẬT KHẨU (BỎ TRỐNG NẾU KHÔNG ĐỔI)
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="settings-password" className="text-primary/80 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-primary" />
                                Mật Khẩu Mới
                            </Label>
                            <Input
                                id="settings-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-[#030712]/90 border-primary/30 focus:border-primary text-white font-mono text-xs"
                            />
                        </div>

                        {password && (
                            <div className="space-y-1.5">
                                <Label htmlFor="settings-confirmPassword" className="text-primary/80 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                    Xác Nhận Mật Khẩu Mới
                                </Label>
                                <Input
                                    id="settings-confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="bg-[#030712]/90 border-primary/30 focus:border-primary text-white font-mono text-xs"
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-3">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-primary text-black font-mono font-bold uppercase tracking-wider w-full cyber-clip-button hover:bg-primary/90 shadow-[0_0_20px_var(--color-primary)] py-4 cursor-pointer"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    SAVING_IDENTITY...
                                </>
                            ) : (
                                '[ CẬP NHẬT DANH TÍNH ]'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
