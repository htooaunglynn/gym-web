export interface Member {
    id: string
    name: string
    email: string
    phone: string
    avatar: string
    plan: 'Basic' | 'Standard' | 'Premium'
    status: 'Active' | 'Inactive' | 'Suspended'
    trainer: string
    joinDate: string
    dateOfBirth: string
    gender: 'Male' | 'Female'
    address: string
    attendanceRate: number
    emergencyContact: string
}

export interface Trainer {
    id: string
    name: string
    avatar: string
    specialty: string
    rating: number
    members: number
    joinDate: string
}

export interface GymClass {
    id: string
    name: string
    trainer: string
    date: string
    startTime: string
    endTime: string
    capacity: number
    enrolled: number
    type: 'Yoga' | 'HIIT' | 'Pilates' | 'Boxing' | 'Cycling' | 'Strength' | 'Zumba' | 'CrossFit'
    room: string
}

export interface AttendanceRecord {
    id: string
    memberId: string
    memberName: string
    memberAvatar: string
    className: string
    date: string
    checkIn: string
    checkOut: string
    trainer: string
}

export interface Payment {
    id: string
    memberId: string
    memberName: string
    memberAvatar: string
    plan: 'Basic' | 'Standard' | 'Premium'
    amount: number
    date: string
    dueDate: string
    status: 'Paid' | 'Pending' | 'Overdue'
    method: 'Credit Card' | 'Bank Transfer' | 'Cash'
}

export interface LeaveRequest {
    id: string
    trainerId: string
    trainerName: string
    trainerAvatar: string
    type: 'Annual Leave' | 'Sick Leave' | 'Personal Leave' | 'Emergency Leave'
    startDate: string
    endDate: string
    days: number
    status: 'Approved' | 'Pending' | 'Rejected'
    reason: string
}

export interface Message {
    id: string
    senderId: string
    senderName: string
    senderAvatar: string
    preview: string
    timestamp: string
    unread: boolean
    thread: MessageThread[]
}

export interface MessageThread {
    id: string
    senderId: string
    senderName: string
    senderAvatar: string
    content: string
    timestamp: string
    isMe: boolean
}

export interface Applicant {
    id: string
    name: string
    avatar: string
    position: string
    email: string
    phone: string
    appliedDate: string
    experience: string
    status: 'Pending' | 'Interview' | 'Accepted' | 'Rejected'
}

export interface MonthlyStats {
    month: string
    members: number
    revenue: number
    attendance: number
    newJoins: number
}

export interface WeeklyAttendance {
    day: string
    count: number
}

export interface PlanDistribution {
    name: string
    value: number
    color: string
}
