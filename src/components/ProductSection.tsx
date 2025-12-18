import Image from 'next/image'

export default function ProductSection() {
    return (
        <section className="py-12 md:py-20 bg-gotgam-cream">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gotgam-brown mb-4">
                    상품 소개
                </h2>
                <p className="text-center text-gray-600 mb-12">
                    선물하기 좋은 크기와 구성으로 준비했습니다.
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Option 1 */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gotgam-cream">
                        <div className="relative h-64 w-full">
                            <Image
                                src="/images/uploaded_image_0_1765804097961.jpg"
                                alt="30구 곶감 선물세트"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gotgam-brown mb-2">
                                프리미엄 (30구)
                            </h3>
                            <p className="text-gray-500 mb-4">큼직하고 먹음직스러운 최상급 곶감</p>
                            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                <span className="text-2xl font-bold text-gotgam-orange">
                                    40,000원
                                </span>
                                <span className="text-sm bg-gotgam-gold/10 text-gotgam-gold px-3 py-1 rounded-full font-medium">
                                    고급 보자기 포장 포함
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Option 2 */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gotgam-cream">
                        <div className="relative h-64 w-full">
                            <Image
                                src="/images/uploaded_image_1_1765804097961.jpg"
                                alt="35구 곶감 선물세트"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gotgam-brown mb-2">
                                실속형 (35구)
                            </h3>
                            <p className="text-gray-500 mb-4">가족들과 함께 나누기 좋은 구성</p>
                            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                <span className="text-2xl font-bold text-gotgam-orange">
                                    40,000원
                                </span>
                                <span className="text-sm bg-gotgam-gold/10 text-gotgam-gold px-3 py-1 rounded-full font-medium">
                                    고급 보자기 포장 포함
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
