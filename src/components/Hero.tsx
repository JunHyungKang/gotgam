"use client"

import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
    const scrollToOrder = () => {
        const orderSection = document.getElementById('order-form')
        if (orderSection) {
            orderSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-stone-900">
            {/* Background: Tree Image (Atmosphere) */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/gotgam-tree-bg.jpg"
                    alt="영동 곶감 배경"
                    fill
                    className="object-cover opacity-60 blur-[2px] scale-105"
                    priority
                    quality={100}
                />
                {/* Heavy Gradient for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 relative z-10 h-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 pt-20">
                
                {/* Left: Text Content */}
                <div className="flex-1 text-center md:text-left space-y-8 animate-fade-in-up max-w-2xl">
                    <div className="space-y-4">
                        <span className="inline-block px-4 py-1.5 border border-white/30 rounded-full text-sm md:text-base text-white/80 font-light tracking-widest backdrop-blur-sm">
                            2025년 설 명절 선물세트
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white font-serif drop-shadow-lg leading-tight">
                            자연이 빚은 <br/>
                            <span className="text-gotgam-orange">명품 영동 곶감</span>
                        </h1>
                    </div>
                    
                    <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed">
                        물한계곡의 청정한 바람과 농부의 정성으로 완성했습니다.<br className="hidden md:block" />
                        소중한 분께 감사의 마음을 전하세요.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                        <button
                            onClick={scrollToOrder}
                            className="px-8 py-4 bg-gotgam-orange hover:bg-orange-600 text-white rounded-full shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1 text-lg font-bold min-w-[160px]"
                        >
                            주문하기
                        </button>
                        
                        <Link
                            href="/check"
                            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all hover:-translate-y-1 text-lg font-medium min-w-[160px]"
                        >
                            주문 조회
                        </Link>
                    </div>
                </div>

                {/* Right: Product Image Card (Visibility) */}
                <div className="flex-1 w-full max-w-md md:max-w-lg relative animate-fade-in-up delay-200 hidden md:block">
                    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                        <Image
                            src="/images/uploaded_image_3_1765804097961.jpg"
                            alt="영동 곶감 선물세트"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {/* Glass Badge */}
                        <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white">
                            <p className="font-serif text-lg">명품 세트 30구 / 35구</p>
                            <p className="text-sm text-gray-300">40,000원 ~</p>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -z-10 top-10 -right-10 w-full h-full border-2 border-white/20 rounded-3xl" />
                </div>
            </div>
        </section>
    )
}
