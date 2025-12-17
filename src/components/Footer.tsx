import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-gotgam-brown text-gotgam-cream py-12">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-xl font-bold mb-4">영동 곶감</h3>
                <p className="mb-2">충청북도 영동군 상촌면 물한리</p>
                <p className="mb-6">문의: 010-XXXX-XXXX</p>

                <div className="border-t border-gotgam-cream/20 pt-6">
                    <p className="text-sm opacity-80 mb-2">무통장 입금 계좌 안내</p>
                    <p className="text-lg font-bold mb-4">우리은행 1002-857-852325 (예금주: 홍주희)</p>

                    <Link href="/check" className="text-sm text-gotgam-orange hover:text-orange-400 underline decoration-gotgam-orange/50 underline-offset-4">
                        주문 내역 조회하기
                    </Link>
                </div>

                <div className="flex justify-center items-center gap-4 mt-8 text-xs">
                    <p className="opacity-50">
                        &copy; {new Date().getFullYear()} Yeongdong Gotgam. All rights reserved.
                    </p>
                    <span className="w-px h-3 bg-gotgam-cream/30"></span>
                    <Link href="/admin" className="text-gotgam-cream/70 hover:text-white hover:underline transition-all font-medium">
                        관리자 홈
                    </Link>
                </div>
            </div>
        </footer>
    )
}
