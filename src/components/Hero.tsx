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
        <section className="relative h-screen min-h-[450px] max-h-[800px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/uploaded_image_3_1765804097961.jpg"
                    alt="영동 곶감 배경"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">
                    영동 곶감
                </h1>
                <p className="text-xl md:text-2xl text-gotgam-cream mb-8 font-light drop-shadow-sm">
                    물한계곡 청정 자연이 빚어낸 달콤한 선물
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={scrollToOrder}
                        className="bg-gotgam-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg text-lg"
                    >
                        주문하기
                    </button>
                    <Link
                        href="/check"
                        className="bg-white/90 hover:bg-white text-gotgam-brown font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg text-lg border border-gotgam-cream"
                    >
                        주문 조회
                    </Link>
                </div>
            </div>
        </section>
    )
}
