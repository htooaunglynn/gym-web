import type { Trainer, PlanDistribution, LeaveRequest, MonthlyStats } from '@/types'

export const trainers: Trainer[] = [
    { id: 't001', name: 'Sarah Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', specialty: 'Yoga & Pilates', rating: 4.8, members: 62, joinDate: '2021-06-12' },
    { id: 't002', name: 'Chris Evans', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris', specialty: 'HIIT & CrossFit', rating: 4.9, members: 58, joinDate: '2020-03-18' },
    { id: 't003', name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', specialty: 'Strength & Boxing', rating: 4.7, members: 54, joinDate: '2019-11-05' },
    { id: 't004', name: 'Nina Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nina', specialty: 'Cycling', rating: 4.6, members: 39, joinDate: '2022-01-22' },
    { id: 't005', name: 'Leo Martin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo', specialty: 'Functional Training', rating: 4.5, members: 33, joinDate: '2023-04-15' },
]

export const monthlyStats: MonthlyStats[] = [
    { month: 'Jan', members: 210, revenue: 8300, attendance: 68, newJoins: 18 },
    { month: 'Feb', members: 224, revenue: 9100, attendance: 70, newJoins: 14 },
    { month: 'Mar', members: 241, revenue: 9800, attendance: 74, newJoins: 19 },
    { month: 'Apr', members: 256, revenue: 10650, attendance: 76, newJoins: 17 },
    { month: 'May', members: 269, revenue: 11200, attendance: 78, newJoins: 15 },
    { month: 'Jun', members: 281, revenue: 11850, attendance: 79, newJoins: 13 },
    { month: 'Jul', members: 294, revenue: 12200, attendance: 80, newJoins: 14 },
    { month: 'Aug', members: 307, revenue: 12450, attendance: 81, newJoins: 15 },
    { month: 'Sep', members: 320, revenue: 12900, attendance: 82, newJoins: 15 },
    { month: 'Oct', members: 335, revenue: 13200, attendance: 84, newJoins: 17 },
    { month: 'Nov', members: 351, revenue: 13650, attendance: 85, newJoins: 18 },
    { month: 'Dec', members: 368, revenue: 14100, attendance: 87, newJoins: 19 },
]

export const planDistribution: PlanDistribution[] = [
    { name: 'Basic', value: 34, color: 'var(--color-chart-2)' },
    { name: 'Standard', value: 40, color: 'var(--color-chart-3)' },
    { name: 'Premium', value: 26, color: 'var(--color-chart-1)' },
]

export const classPopularity = [
    { class: 'Yoga', attendees: 184 },
    { class: 'HIIT', attendees: 161 },
    { class: 'Pilates', attendees: 133 },
    { class: 'Boxing', attendees: 104 },
    { class: 'Cycling', attendees: 145 },
    { class: 'Strength', attendees: 126 },
    { class: 'Zumba', attendees: 157 },
    { class: 'CrossFit', attendees: 119 },
]

export const leaveRequests: LeaveRequest[] = [
    { id: 'l001', trainerId: 't001', trainerName: 'Sarah Lee', trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', type: 'Annual Leave', startDate: '2026-04-11', endDate: '2026-04-14', days: 4, status: 'Approved', reason: 'Family vacation' },
    { id: 'l002', trainerId: 't002', trainerName: 'Chris Evans', trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris', type: 'Sick Leave', startDate: '2026-04-08', endDate: '2026-04-09', days: 2, status: 'Approved', reason: 'Flu recovery' },
    { id: 'l003', trainerId: 't003', trainerName: 'Mike Johnson', trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', type: 'Personal Leave', startDate: '2026-04-16', endDate: '2026-04-16', days: 1, status: 'Pending', reason: 'Personal appointment' },
    { id: 'l004', trainerId: 't004', trainerName: 'Nina Park', trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nina', type: 'Annual Leave', startDate: '2026-04-22', endDate: '2026-04-24', days: 3, status: 'Pending', reason: 'Travel' },
    { id: 'l005', trainerId: 't005', trainerName: 'Leo Martin', trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo', type: 'Emergency Leave', startDate: '2026-04-05', endDate: '2026-04-05', days: 1, status: 'Rejected', reason: 'Insufficient backup coverage' },
    { id: 'l006', trainerId: 't001', trainerName: 'Sarah Lee', trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', type: 'Personal Leave', startDate: '2026-05-02', endDate: '2026-05-03', days: 2, status: 'Approved', reason: 'Workshop attendance' },
]
