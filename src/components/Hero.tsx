"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const productImages = [
    {
        src: "/images/uploaded_image_3_1765804097961.jpg",
        title: "자연 건조로 말린 반건조 곶감 (30구/35구)",
        desc: "명품 세트"
    },
    {
        src: "/images/uploaded_image_0_1765804097961.jpg",
        title: "프리미엄 선물세트 (30구)",
        desc: "최상의 품질"
    },
    {
        src: "/images/uploaded_image_1_1765804097961.jpg",
        title: "실속형 (35구)",
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
        <section className="relative h-auto md:min-h-[700px] flex flex-col md:flex-row items-center overflow-hidden bg-stone-900 pb-8 md:pb-0">
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
            <div className="container mx-auto px-4 relative z-10 w-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 md:gap-12 pt-20 md:pt-20">
                
                <div className="flex-1 text-center md:text-left space-y-6 md:space-y-8 animate-fade-in-up max-w-2xl w-full flex flex-col items-center md:items-start justify-center">
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

                    <div className="flex flex-row w-full px-4 md:px-0 gap-3 justify-center md:justify-start pt-2 md:pt-4">
                        <button
                            onClick={scrollToOrder}
                            className="flex-1 md:flex-none md:w-auto px-4 md:px-8 py-3 md:py-4 bg-gotgam-orange hover:bg-orange-600 text-white rounded-full shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1 text-base md:text-lg font-bold whitespace-nowrap"
                        >
                            주문하기
                        </button>
                        
                        <Link
                            href="/check"
                            className="flex-1 md:flex-none md:w-auto px-4 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all hover:-translate-y-1 text-base md:text-lg font-medium text-center whitespace-nowrap"
                        >
                            주문 조회
                        </Link>
                    </div>
                </div>

                {/* Right: Product Image Carousel (Stacked Cards) - Desktop Only */}
                <div className="flex-1 w-full max-w-md md:max-w-lg relative animate-fade-in-up delay-200 hidden md:block h-[500px] perspective-1000">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {productImages.map((img, index) => {
                            // Calculate position relative to current slide
                            // 0: Active, 1: Next, 2: Last (in 3 items)
                            const position = (index - currentSlide + productImages.length) % productImages.length;
                            
                            let cardStyle = "";
                            let zIndex = 0;

                            if (position === 0) { // Active
                                cardStyle = "scale-100 opacity-100 rotate-0 translate-x-0 translate-y-0 shadow-2xl skew-x-0";
                                zIndex = 30;
                            } else if (position === 1) { // Next
                                cardStyle = "scale-95 opacity-70 rotate-6 translate-x-8 translate-y-4 shadow-xl";
                                zIndex = 20;
                            } else { // Last (Upcoming / Previous)
                                cardStyle = "scale-90 opacity-40 rotate-12 translate-x-16 translate-y-8 shadow-lg";
                                zIndex = 10;
                            }

                            return (
                                <div 
                                    key={index}
                                    className={`absolute w-full aspect-square rounded-3xl overflow-hidden border border-white/10 ring-1 ring-white/20 transition-all duration-700 ease-in-out bg-stone-800 ${cardStyle}`}
                                    style={{ zIndex }}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    {/* Glass Badge - Only visible on active card */}
                                    <div className={`absolute bottom-6 left-6 right-6 bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white transition-opacity duration-300 ${position === 0 ? 'opacity-100' : 'opacity-0'}`}>
                                        <p className="font-serif text-lg">{img.title}</p>
                                        <p className="text-sm text-gray-300">{img.desc}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                    {/* Carousel Indicators */}
                    <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
                        {productImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-gotgam-orange w-6' : 'bg-white/30 hover:bg-white/50'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Carousel (Peeking Effect) */}
            <div className="md:hidden w-full relative z-10 mt-8 mb-4 pl-4 overflow-x-hidden">
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory px-4" style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '20%' }}>
                    {productImages.map((img, index) => (
                        <div 
                            key={index} 
                            className="flex-none w-[85%] aspect-[4/3] relative rounded-2xl overflow-hidden shadow-lg snap-center border border-white/10 bg-stone-800"
                        >
                            <Image
                                src={img.src}
                                alt={img.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <p className="font-bold text-lg mb-1">{img.title}</p>
                                <p className="text-sm text-gray-300">{img.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
