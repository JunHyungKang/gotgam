"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const productImages = [
    {
        src: "/images/uploaded_image_3_1765804097961.jpg",
        title: "명품 세트 30구 / 35구",
        desc: "40,000원 ~"
    },
    {
        src: "/images/uploaded_image_0_1765804097961.jpg",
        title: "프리미엄 선물세트",
        desc: "최상의 품질"
    },
    {
        src: "/images/uploaded_image_1_1765804097961.jpg",
        title: "실속형 가정용",
        desc: "달콤한 간식"
    }
]

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % productImages.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    const scrollToOrder = () => {
        const orderSection = document.getElementById('order-form')
        if (orderSection) {
            orderSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <section className="relative min-h-[600px] h-auto flex items-center overflow-hidden bg-stone-900 pb-12 pt-24 md:pt-0">
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
            <div className="container mx-auto px-4 relative z-10 h-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 md:gap-12">
                
                <div className="flex-1 text-center md:text-left space-y-6 md:space-y-8 animate-fade-in-up max-w-2xl w-full flex flex-col items-center md:items-start justify-center order-1 md:order-1 mt-8 md:mt-0">
                    <div className="space-y-2 md:space-y-4">
                        <h1 className="text-4xl md:text-7xl text-white drop-shadow-lg leading-tight font-['Noto_Sans_KR'] font-bold">
                            물한리 자연이 빚은 <br/>
                            <span className="text-gotgam-orange">명품 곶감</span>
                        </h1>
                    </div>
                    
                    <div className="space-y-2 text-gray-200 leading-relaxed font-['Noto_Sans_KR']">
                        <p className="text-base md:text-xl font-medium break-keep">
                            충북 영동군 물한리 민주지산 자연휴양림 인근 청정 지역에서 <br className="hidden md:block" />
                            시부모님께서 직접 농사지은 감으로 정성껏 만든 곶감입니다.
                        </p>
                        <p className="text-sm md:text-lg font-thin break-keep text-gray-300">
                            쫀득한 식감과 달콤함이 특징이며, 대부분 씨가 없어 먹기에도 편합니다. <br className="hidden md:block" />
                            (드물게 씨가 있을 수 있습니다)
                        </p>
                    </div>

                    <div className="flex flex-col w-full px-8 md:px-0 gap-3 justify-center md:justify-start pt-2 md:pt-4">
                        <button
                            onClick={scrollToOrder}
                            className="w-full md:w-auto px-8 py-3 md:py-4 bg-gotgam-orange hover:bg-orange-600 text-white rounded-full shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1 text-lg font-bold"
                        >
                            주문하기
                        </button>
                        
                        <Link
                            href="/check"
                            className="w-full md:w-auto px-8 py-3 md:py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all hover:-translate-y-1 text-lg font-medium text-center"
                        >
                            주문 조회
                        </Link>
                    </div>
                </div>

                {/* Right: Product Image Carousel (Peeking Effect) */}
                <div className="flex-1 w-full max-w-md md:max-w-lg relative animate-fade-in-up delay-200 h-[320px] md:h-[500px] perspective-1000 order-2 md:order-2 mt-4 md:mt-0">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {productImages.map((img, index) => {
                            // Calculate position relative to current slide
                            // 0: Active, 1: Next, 2: Last (Prev)
                            const position = (index - currentSlide + productImages.length) % productImages.length;
                            
                            let cardStyle = "";
                            let zIndex = 0;

                            if (position === 0) { // Active (Center)
                                cardStyle = "left-1/2 -translate-x-1/2 scale-100 opacity-100 z-30 shadow-2xl";
                            } else if (position === 1) { // Next (Right Peeking)
                                cardStyle = "left-[85%] -translate-x-1/2 scale-90 opacity-50 z-10 shadow-lg blur-[1px] brightness-50";
                            } else { // Prev (Left Peeking) - position 2 in 3 items
                                cardStyle = "left-[15%] -translate-x-1/2 scale-90 opacity-50 z-10 shadow-lg blur-[1px] brightness-50";
                            }

                            return (
                                <div 
                                    key={index}
                                    className={`absolute top-1/2 -translate-y-1/2 w-[70%] md:w-[70%] aspect-square rounded-3xl overflow-hidden border border-white/10 ring-1 ring-white/20 transition-all duration-700 ease-in-out bg-stone-800 ${cardStyle}`}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 70vw, 35vw"
                                    />
                                    {/* Glass Badge - Only visible on active card */}
                                    <div className={`absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-black/50 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/10 text-white transition-opacity duration-300 ${position === 0 ? 'opacity-100' : 'opacity-0'}`}>
                                        <p className="font-serif text-base md:text-lg font-bold">{img.title}</p>
                                        <p className="text-xs md:text-sm text-gray-300">{img.desc}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
