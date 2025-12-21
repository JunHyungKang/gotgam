
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'

// Mock coolsms-node-sdk as a class
const mockSendOne = vi.fn()

vi.mock('coolsms-node-sdk', () => {
    return {
        default: class CoolsmsMessageService {
            constructor(apiKey: string, apiSecret: string) {
                // Constructor logic if needed
            }
            sendOne(...args: any[]) {
                return mockSendOne(...args)
            }
        }
    }
})

describe('POST /api/send-sms', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        process.env.SOLAPI_API_KEY = 'test-api-key'
        process.env.SOLAPI_API_SECRET = 'test-api-secret'
        process.env.SENDER_PHONE_NUMBER = '01000000000'
    })

    it('should return 400 if required fields are missing', async () => {
        const req = new Request('http://localhost/api/send-sms', {
            method: 'POST',
            body: JSON.stringify({
                phone: '01012345678'
                // Missing other fields
            })
        })

        const res = await POST(req)
        const json = await res.json()

        expect(res.status).toBe(400)
        expect(json.success).toBe(false)
    })

    it('should send SMS successfully when all fields are present', async () => {
        mockSendOne.mockResolvedValue({ group_id: 'test_group', result_code: '00' })

        const req = new Request('http://localhost/api/send-sms', {
            method: 'POST',
            body: JSON.stringify({
                phone: '01012345678',
                name: 'TestUser',
                orderDetails: 'Persimmon Box 1',
                totalAmount: 50000
            })
        })

        const res = await POST(req)
        const json = await res.json()

        expect(res.status).toBe(200)
        expect(json.success).toBe(true)
        expect(mockSendOne).toHaveBeenCalledTimes(1)
        expect(mockSendOne).toHaveBeenCalledWith(expect.objectContaining({
            to: '01012345678',
            from: '01000000000',
            type: 'LMS'
        }))
    })

    it('should return 500 if Solapi SDK throws an error', async () => {
        mockSendOne.mockRejectedValue(new Error('Solapi Error'))

        const req = new Request('http://localhost/api/send-sms', {
            method: 'POST',
            body: JSON.stringify({
                phone: '01012345678',
                name: 'TestUser',
                orderDetails: 'Persimmon Box 1',
                totalAmount: 50000
            })
        })

        const res = await POST(req)
        const json = await res.json()

        expect(res.status).toBe(500)
        expect(json.success).toBe(false)
        expect(json.error).toBe('Solapi Error')
    })
})
