### Folder Structure (Implemented)
src/
│
├── app/                # app config (providers/bootstrap)
├── routes/             # routing setup
│
├── features/           # ⭐ MAIN LOGIC (by domain)
│   ├── auth/
│   ├── dashboard/
│   ├── members/
│   ├── trainers/
│   ├── payments/
│   ├── attendance/
│   ├── payroll/
│   ├── performance/
│   ├── recruitment/
│   ├── inbox/
│   ├── leave/
│   ├── schedule/
│   └── subscriptions/
│
├── components/         # shared UI components
│   ├── Button/
│   ├── Modal/
│   ├── Table/
│   ├── Avatar/
│   ├── Card/
│   ├── Input/
│   ├── Select/
│   ├── PageHeader/
│   ├── StatCard/
│   └── StatusBadge/
│
├── services/           # cross-feature service layer
├── hooks/              # reusable hooks
├── utils/              # helper functions
├── types/              # TypeScript types
├── constants/
├── assets/
└── layouts/



### Example: Feature Folder (members)
features/members/
│
├── pages/
│   ├── MembersList.tsx
│   └── MemberDetail.tsx
│
├── services/
│   ├── memberService.ts
│   └── index.ts
│
├── hooks/
│   ├── useMembers.ts
│   └── index.ts
│
├── data.ts
├── types.ts
└── index.ts


### Pro Tips (Important)
1. Don’t over-engineer early
Start simple:
features/members
features/auth

2. Separate UI vs Logic
components/ → UI only
services/ → API calls
hooks/ → logic

3. Keep consistency
If you choose:
features/members/services
👉 do same for all features

4. Prefer direct component imports
Use components/Button, components/Table, components/Card, etc.
Keep components/shared, components/ui, and components/layout only as temporary compatibility shims.



🚀 Advanced (Optional Later)
If your app grows big:
Add state management (Redux Toolkit / Zustand)
Use API layer pattern
Introduce clean architecture
