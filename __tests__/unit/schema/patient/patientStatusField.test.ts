import { describe, it, expect } from 'vitest'
import { PatientSchema } from '@/schema/patient'

const basePayload = {
    name: 'John Doe',
    sex: 'male' as const,
    dob: '1990-01-01',
    address: 'Some address',
    assignedHospital: { id: 'h1', name: 'Test Hospital' },
    hasAadhaar: true,
}

describe('PatientSchema - patientStatus field validation', () => {
    it.each(['Active', 'Inactive', 'Cured'])('accepts %s', (status) => {
        const result = PatientSchema.safeParse({
            ...basePayload,
            patientStatus: status,
        })

        expect(result.success).toBe(true)
    })

    it.each(['Alive', 'Not Alive'])('rejects legacy status %s', (status) => {
        const result = PatientSchema.safeParse({
            ...basePayload,
            patientStatus: status,
        })

        expect(result.success).toBe(false)
    })
})
