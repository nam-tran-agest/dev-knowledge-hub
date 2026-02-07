'use client';

import { Input } from '@/components/ui/input';

export function NewsSubscription() {
    return (
        <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-12 text-center space-y-6">
            <div className="max-w-2xl mx-auto space-y-4">
                <h2 className="text-3xl font-bold">Nhận những tin tức hay nhất vào hòm thư của bạn</h2>
                <p className="text-slate-400">Đăng ký nhận bản tin tổng hợp hàng tuần về công nghệ & thế giới từ chúng tôi.</p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Input
                        placeholder="Nhập địa chỉ email của bạn"
                        className="bg-[#1e1e24]/50 border-white/5 h-12 px-6 rounded-xl"
                    />
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 h-12 rounded-xl transition-colors shrink-0">Đăng ký ngay</button>
                </div>
            </div>
        </section>
    );
}
