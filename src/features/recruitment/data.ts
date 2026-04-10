import type { Applicant } from '@/types'

export const applicants: Applicant[] = [
  { id: 'r001', name: 'Olivia Santos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia', position: 'Fitness Trainer', email: 'olivia.santos@example.com', phone: '+1 555 110 2000', appliedDate: '2026-03-22', experience: '4 years', status: 'Interview' },
  { id: 'r002', name: 'Noah Ali', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah', position: 'Front Desk Executive', email: 'noah.ali@example.com', phone: '+1 555 110 2001', appliedDate: '2026-03-24', experience: '3 years', status: 'Pending' },
  { id: 'r003', name: 'Maya Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya', position: 'Nutrition Coach', email: 'maya.chen@example.com', phone: '+1 555 110 2002', appliedDate: '2026-03-25', experience: '5 years', status: 'Accepted' },
  { id: 'r004', name: 'Aiden Moore', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden', position: 'Strength Coach', email: 'aiden.moore@example.com', phone: '+1 555 110 2003', appliedDate: '2026-03-26', experience: '6 years', status: 'Interview' },
  { id: 'r005', name: 'Sara Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara', position: 'Yoga Instructor', email: 'sara.kim@example.com', phone: '+1 555 110 2004', appliedDate: '2026-03-27', experience: '2 years', status: 'Pending' },
  { id: 'r006', name: 'Leo Martins', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LeoR', position: 'Operations Assistant', email: 'leo.martins@example.com', phone: '+1 555 110 2005', appliedDate: '2026-03-28', experience: '4 years', status: 'Rejected' },
  { id: 'r007', name: 'Emma Carter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmmaR', position: 'Group Class Trainer', email: 'emma.carter@example.com', phone: '+1 555 110 2006', appliedDate: '2026-03-29', experience: '3 years', status: 'Interview' },
  { id: 'r008', name: 'Yusuf Khan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yusuf', position: 'Receptionist', email: 'yusuf.khan@example.com', phone: '+1 555 110 2007', appliedDate: '2026-03-30', experience: '2 years', status: 'Pending' },
]

export const applicationsByMonth = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 17 },
  { month: 'Mar', count: 24 },
  { month: 'Apr', count: 21 },
  { month: 'May', count: 26 },
  { month: 'Jun', count: 18 },
]
