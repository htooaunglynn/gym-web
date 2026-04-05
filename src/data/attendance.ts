import type { AttendanceRecord, WeeklyAttendance } from '@/types'

export const attendanceRecords: AttendanceRecord[] = [
    { id: 'a001', memberId: 'm001', memberName: 'Mia Torres', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia', className: 'Morning Yoga', date: '2026-04-05', checkIn: '06:58', checkOut: '08:02', trainer: 'Sarah Lee' },
    { id: 'a002', memberId: 'm003', memberName: 'Priya Sharma', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', className: 'HIIT Blast', date: '2026-04-05', checkIn: '08:55', checkOut: '10:05', trainer: 'Chris Evans' },
    { id: 'a003', memberId: 'm006', memberName: 'Ethan Brooks', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan', className: 'Boxing Fundamentals', date: '2026-04-05', checkIn: '17:02', checkOut: '18:35', trainer: 'Mike Johnson' },
    { id: 'a004', memberId: 'm012', memberName: 'Marcus Williams', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', className: 'Spin Class', date: '2026-04-05', checkIn: '18:28', checkOut: '19:33', trainer: 'Chris Evans' },
    { id: 'a005', memberId: 'm015', memberName: 'Emma Wilson', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', className: 'Morning Yoga', date: '2026-04-05', checkIn: '07:01', checkOut: '08:01', trainer: 'Sarah Lee' },
    { id: 'a006', memberId: 'm002', memberName: 'Jake Ramirez', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jake', className: 'HIIT Blast', date: '2026-04-04', checkIn: '09:03', checkOut: '10:00', trainer: 'Chris Evans' },
    { id: 'a007', memberId: 'm005', memberName: 'Amara Diallo', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amara', className: 'Pilates Core', date: '2026-04-04', checkIn: '11:00', checkOut: '12:00', trainer: 'Sarah Lee' },
    { id: 'a008', memberId: 'm009', memberName: 'Lena Mueller', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lena', className: 'Strength & Conditioning', date: '2026-04-04', checkIn: '08:05', checkOut: '09:32', trainer: 'Mike Johnson' },
    { id: 'a009', memberId: 'm011', memberName: 'Yuki Tanaka', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki', className: 'Zumba Party', date: '2026-04-03', checkIn: '10:02', checkOut: '11:01', trainer: 'Sarah Lee' },
    { id: 'a010', memberId: 'm017', memberName: 'Fatima Al-Rashid', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima', className: 'CrossFit WOD', date: '2026-04-03', checkIn: '16:00', checkOut: '17:03', trainer: 'Chris Evans' },
    { id: 'a011', memberId: 'm001', memberName: 'Mia Torres', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia', className: 'Pilates Core', date: '2026-04-03', checkIn: '11:00', checkOut: '12:02', trainer: 'Sarah Lee' },
    { id: 'a012', memberId: 'm003', memberName: 'Priya Sharma', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', className: 'Morning Yoga', date: '2026-04-02', checkIn: '07:00', checkOut: '08:00', trainer: 'Sarah Lee' },
    { id: 'a013', memberId: 'm006', memberName: 'Ethan Brooks', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan', className: 'CrossFit WOD', date: '2026-04-02', checkIn: '16:01', checkOut: '17:02', trainer: 'Chris Evans' },
    { id: 'a014', memberId: 'm012', memberName: 'Marcus Williams', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', className: 'Strength & Conditioning', date: '2026-04-02', checkIn: '08:00', checkOut: '09:28', trainer: 'Mike Johnson' },
    { id: 'a015', memberId: 'm013', memberName: 'Aisha Patel', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha', className: 'Zumba Party', date: '2026-04-01', checkIn: '09:58', checkOut: '11:05', trainer: 'Sarah Lee' },
    { id: 'a016', memberId: 'm019', memberName: 'Natasha Ivanova', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Natasha', className: 'Boxing Fundamentals', date: '2026-04-01', checkIn: '17:00', checkOut: '18:30', trainer: 'Mike Johnson' },
    { id: 'a017', memberId: 'm015', memberName: 'Emma Wilson', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', className: 'HIIT Blast', date: '2026-04-01', checkIn: '09:00', checkOut: '10:00', trainer: 'Chris Evans' },
    { id: 'a018', memberId: 'm009', memberName: 'Lena Mueller', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lena', className: 'Evening Yoga', date: '2026-03-31', checkIn: '19:00', checkOut: '20:00', trainer: 'Sarah Lee' },
    { id: 'a019', memberId: 'm011', memberName: 'Yuki Tanaka', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki', className: 'HIIT Advance', date: '2026-03-31', checkIn: '07:30', checkOut: '08:32', trainer: 'Mike Johnson' },
    { id: 'a020', memberId: 'm002', memberName: 'Jake Ramirez', memberAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jake', className: 'Spin Class', date: '2026-03-31', checkIn: '18:30', checkOut: '19:31', trainer: 'Chris Evans' },
]

export const weeklyAttendance: WeeklyAttendance[] = [
    { day: 'Mon', count: 42 },
    { day: 'Tue', count: 38 },
    { day: 'Wed', count: 55 },
    { day: 'Thu', count: 47 },
    { day: 'Fri', count: 61 },
    { day: 'Sat', count: 73 },
    { day: 'Sun', count: 29 },
]
