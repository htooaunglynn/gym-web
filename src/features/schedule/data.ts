import type { GymClass } from '@/types'

export const classes: GymClass[] = [
    { id: 'c001', name: 'Morning Yoga', trainer: 'Sarah Lee', date: '2026-04-05', startTime: '07:00', endTime: '08:00', capacity: 20, enrolled: 18, type: 'Yoga', room: 'Studio A' },
    { id: 'c002', name: 'HIIT Blast', trainer: 'Chris Evans', date: '2026-04-05', startTime: '09:00', endTime: '10:00', capacity: 15, enrolled: 15, type: 'HIIT', room: 'Main Floor' },
    { id: 'c003', name: 'Pilates Core', trainer: 'Sarah Lee', date: '2026-04-05', startTime: '11:00', endTime: '12:00', capacity: 12, enrolled: 10, type: 'Pilates', room: 'Studio B' },
    { id: 'c004', name: 'Boxing Fundamentals', trainer: 'Mike Johnson', date: '2026-04-05', startTime: '17:00', endTime: '18:30', capacity: 10, enrolled: 9, type: 'Boxing', room: 'Boxing Ring' },
    { id: 'c005', name: 'Spin Class', trainer: 'Chris Evans', date: '2026-04-05', startTime: '18:30', endTime: '19:30', capacity: 20, enrolled: 20, type: 'Cycling', room: 'Cycle Studio' },
    { id: 'c006', name: 'Strength & Conditioning', trainer: 'Mike Johnson', date: '2026-04-06', startTime: '08:00', endTime: '09:30', capacity: 12, enrolled: 11, type: 'Strength', room: 'Weight Room' },
    { id: 'c007', name: 'Zumba Party', trainer: 'Sarah Lee', date: '2026-04-06', startTime: '10:00', endTime: '11:00', capacity: 25, enrolled: 22, type: 'Zumba', room: 'Main Floor' },
    { id: 'c008', name: 'CrossFit WOD', trainer: 'Chris Evans', date: '2026-04-06', startTime: '16:00', endTime: '17:00', capacity: 15, enrolled: 14, type: 'CrossFit', room: 'CrossFit Box' },
    { id: 'c009', name: 'Evening Yoga', trainer: 'Sarah Lee', date: '2026-04-07', startTime: '19:00', endTime: '20:00', capacity: 20, enrolled: 16, type: 'Yoga', room: 'Studio A' },
    { id: 'c010', name: 'HIIT Advance', trainer: 'Mike Johnson', date: '2026-04-07', startTime: '07:30', endTime: '08:30', capacity: 15, enrolled: 13, type: 'HIIT', room: 'Main Floor' },
    { id: 'c011', name: 'Pilates Stretch', trainer: 'Sarah Lee', date: '2026-04-08', startTime: '10:00', endTime: '11:00', capacity: 12, enrolled: 8, type: 'Pilates', room: 'Studio B' },
    { id: 'c012', name: 'Boxing Advanced', trainer: 'Chris Evans', date: '2026-04-08', startTime: '17:00', endTime: '18:30', capacity: 8, enrolled: 8, type: 'Boxing', room: 'Boxing Ring' },
    { id: 'c013', name: 'Endurance Cycling', trainer: 'Mike Johnson', date: '2026-04-09', startTime: '06:30', endTime: '07:30', capacity: 20, enrolled: 17, type: 'Cycling', room: 'Cycle Studio' },
    { id: 'c014', name: 'Full Body Strength', trainer: 'Chris Evans', date: '2026-04-09', startTime: '09:00', endTime: '10:30', capacity: 12, enrolled: 10, type: 'Strength', room: 'Weight Room' },
    { id: 'c015', name: 'Zumba Fitness', trainer: 'Sarah Lee', date: '2026-04-10', startTime: '10:00', endTime: '11:00', capacity: 25, enrolled: 20, type: 'Zumba', room: 'Main Floor' },
    { id: 'c016', name: 'CrossFit Challenge', trainer: 'Mike Johnson', date: '2026-04-10', startTime: '16:00', endTime: '17:00', capacity: 15, enrolled: 12, type: 'CrossFit', room: 'CrossFit Box' },
    { id: 'c017', name: 'Sunrise Yoga', trainer: 'Sarah Lee', date: '2026-04-11', startTime: '06:00', endTime: '07:00', capacity: 20, enrolled: 15, type: 'Yoga', room: 'Studio A' },
    { id: 'c018', name: 'HIIT Cardio', trainer: 'Chris Evans', date: '2026-04-12', startTime: '09:00', endTime: '10:00', capacity: 15, enrolled: 14, type: 'HIIT', room: 'Main Floor' },
    { id: 'c019', name: 'Pilates Balance', trainer: 'Mike Johnson', date: '2026-04-13', startTime: '11:00', endTime: '12:00', capacity: 12, enrolled: 9, type: 'Pilates', room: 'Studio B' },
    { id: 'c020', name: 'Boxing Conditioning', trainer: 'Sarah Lee', date: '2026-04-14', startTime: '17:00', endTime: '18:30', capacity: 10, enrolled: 7, type: 'Boxing', room: 'Boxing Ring' },
    { id: 'c021', name: 'Sprint Cycling', trainer: 'Chris Evans', date: '2026-04-15', startTime: '18:30', endTime: '19:30', capacity: 20, enrolled: 19, type: 'Cycling', room: 'Cycle Studio' },
    { id: 'c022', name: 'Power Strength', trainer: 'Mike Johnson', date: '2026-04-16', startTime: '08:00', endTime: '09:30', capacity: 12, enrolled: 11, type: 'Strength', room: 'Weight Room' },
    { id: 'c023', name: 'Dance Zumba', trainer: 'Sarah Lee', date: '2026-04-17', startTime: '10:00', endTime: '11:00', capacity: 25, enrolled: 23, type: 'Zumba', room: 'Main Floor' },
    { id: 'c024', name: 'CrossFit Teams', trainer: 'Chris Evans', date: '2026-04-18', startTime: '16:00', endTime: '17:00', capacity: 15, enrolled: 15, type: 'CrossFit', room: 'CrossFit Box' },
    { id: 'c025', name: 'Flow Yoga', trainer: 'Mike Johnson', date: '2026-04-19', startTime: '19:00', endTime: '20:00', capacity: 20, enrolled: 14, type: 'Yoga', room: 'Studio A' },
    { id: 'c026', name: 'Tabata HIIT', trainer: 'Sarah Lee', date: '2026-04-20', startTime: '07:30', endTime: '08:30', capacity: 15, enrolled: 12, type: 'HIIT', room: 'Main Floor' },
    { id: 'c027', name: 'Pilates Flow', trainer: 'Chris Evans', date: '2026-04-21', startTime: '10:00', endTime: '11:00', capacity: 12, enrolled: 10, type: 'Pilates', room: 'Studio B' },
    { id: 'c028', name: 'Boxing Circuit', trainer: 'Mike Johnson', date: '2026-04-22', startTime: '17:00', endTime: '18:30', capacity: 10, enrolled: 9, type: 'Boxing', room: 'Boxing Ring' },
    { id: 'c029', name: 'Cycling Intervals', trainer: 'Sarah Lee', date: '2026-04-23', startTime: '06:30', endTime: '07:30', capacity: 20, enrolled: 16, type: 'Cycling', room: 'Cycle Studio' },
    { id: 'c030', name: 'Strength Circuit', trainer: 'Chris Evans', date: '2026-04-24', startTime: '09:00', endTime: '10:30', capacity: 12, enrolled: 12, type: 'Strength', room: 'Weight Room' },
]

export const classTypes = ['Yoga', 'HIIT', 'Pilates', 'Boxing', 'Cycling', 'Strength', 'Zumba', 'CrossFit'] as const

export const typeColors: Record<string, string> = {
    Yoga: 'bg-blue-100 text-blue-700',
    HIIT: 'bg-red-100 text-red-700',
    Pilates: 'bg-purple-100 text-purple-700',
    Boxing: 'bg-orange-100 text-orange-700',
    Cycling: 'bg-cyan-100 text-cyan-700',
    Strength: 'bg-amber-100 text-amber-700',
    Zumba: 'bg-pink-100 text-pink-700',
    CrossFit: 'bg-emerald-100 text-emerald-700',
}
