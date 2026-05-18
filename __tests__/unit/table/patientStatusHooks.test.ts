import { renderHook } from '@testing-library/react'
import { describe, expect, beforeEach, it } from 'vitest'
import { useFilteredPatients } from '@/hooks/table/useFilteredPatients'
import { useStats } from '@/hooks/table/useStats'
import { usePatientFilterStore } from '@/store/patient-filter-store'
import { Patient } from '@/schema/patient'

const patients: Patient[] = [
    {
        id: '1',
        name: 'Active Patient',
        sex: 'male',
        address: 'Address 1',
        assignedHospital: { id: 'h1', name: 'Hospital 1' },
        hasAadhaar: true,
        patientStatus: 'Active',
    },
    {
        id: '2',
        name: 'Inactive Patient',
        sex: 'female',
        address: 'Address 2',
        assignedHospital: { id: 'h1', name: 'Hospital 1' },
        hasAadhaar: true,
        patientStatus: 'Inactive',
    },
]

describe('patient status hooks', () => {
    beforeEach(() => {
        usePatientFilterStore.getState().reset()
    })

    it('filters patients correctly when status filter uses title case options', () => {
        usePatientFilterStore.getState().setFilter('statuses', ['Active'])

        const { result } = renderHook(() => useFilteredPatients(patients))

        expect(result.current).toHaveLength(1)
        expect(result.current[0].patientStatus).toBe('Active')
    })

    it('counts new and legacy patient statuses in stats', () => {
        const { result } = renderHook(() =>
            useStats({
                TableData: [
                    { patientStatus: 'Active', assignedAsha: 'asha-1', sex: 'male' },
                    { patientStatus: 'Cured', assignedAsha: 'asha-2', sex: 'female' },
                    { patientStatus: 'Alive', assignedAsha: 'asha-3', sex: 'male' },
                    { patientStatus: 'Inactive', sex: 'female' },
                    { patientStatus: 'Not Alive', sex: 'other' },
                ],
                isPatientTab: true,
                isHospitalTab: false,
            })
        )

        expect(result.current.alive).toBe(3)
        expect(result.current.deceased).toBe(2)
        expect(result.current.assigned).toBe(3)
        expect(result.current.unassigned).toBe(2)
    })
})
