import { NextResponse } from 'next/server'
// @ts-ignore - The SDK types might not be perfect
import CoolsmsMessageService from 'coolsms-node-sdk'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { phone, name, orderDetails, totalAmount } = body

        if (!phone || !name || !orderDetails || !totalAmount) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate Environment Variables
        const apiKey = process.env.SOLAPI_API_KEY
        const apiSecret = process.env.SOLAPI_API_SECRET
        const senderPhone = process.env.SENDER_PHONE_NUMBER

        if (!apiKey || !apiSecret || !senderPhone) {
            console.error('Missing Solapi environment variables')
            return NextResponse.json(
                { success: false, error: 'Server configuration error' },
                { status: 500 }
            )
        }

        // Message Content
        // LMS allows up to 2000 bytes.
        const title = '곶감 주문 확인'
        const messageText = `${name}님, 주문해주셔서 감사합니다.\n\n[주문 내역]\n${orderDetails}\n\n결제 금액: ${totalAmount.toLocaleString()}원\n입금 계좌: 우리은행 1002-857-852325 (예금주: 홍주희)\n\n입금 확인 후 정성스럽게 포장하여 보내드리겠습니다.`

        // Send Message
        try {
            const messageService = new CoolsmsMessageService(apiKey, apiSecret)

            // Send to Customer
            const p1 = messageService.sendOne({
                to: phone,
                from: senderPhone,
                subject: title,
                text: messageText,
                type: 'LMS',
                autoTypeDetect: true
            })

            // Send to Seller (Admin)
            // User requested to send to 01031533822
            const sellerPhone = '01031533822'
            const p2 = messageService.sendOne({
                to: sellerPhone,
                from: senderPhone,
                subject: `[신규주문] ${title}`,
                text: messageText,
                type: 'LMS',
                autoTypeDetect: true
            })

            const [result, result2] = await Promise.all([p1, p2])

            return NextResponse.json({ success: true, data: { customer: result, seller: result2 } })
        } catch (sdkError: any) {
            console.error('Solapi SDK Error:', sdkError)
            return NextResponse.json(
                { success: false, error: sdkError.message || 'SMS sending failed' },
                { status: 500 }
            )
        }

    } catch (error: any) {
        console.error('API Route Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
