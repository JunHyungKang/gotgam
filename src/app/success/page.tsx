import Link from 'next/link'

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gotgam-cream p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-gotgam-orange/20">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gotgam-brown mb-4">주문이 완료되었습니다!</h1>
                <p className="text-gray-600 mb-8">
                    영동 곶감을 찾아주셔서 감사합니다.<br />
                    입금 확인 후 정성껏 포장하여 발송해 드리겠습니다.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-gotgam-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                >
                    메인으로 돌아가기
                </Link>
            </div>
        </div>
    )
}
