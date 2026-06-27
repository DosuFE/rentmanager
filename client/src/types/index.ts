export type Role = 'LANDLORD' | 'TENANT'

export type PaymentStatus =
  | 'PENDING'
  | 'PENDING_VERIFICATION'
  | 'PAID'
  | 'OVERDUE'

export type PaymentMethod = 'PAYSTACK' | 'BANK_TRANSFER'

export interface User {
  id: string
  fullName: string
  email: string
  role: Role
}

export interface AuthUser {
  userId: string
  fullName: string
  email: string
  role: Role
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
  landlord?: User
  rooms?: Room[]
}

export interface Room {
  id: string
  roomNumber: string
  floor: number
  capacity: number
  isAvailable: boolean
  property?: Property
  tenants?: Tenant[]
}

export interface Tenant {
  id: number
  name: string
  phoneNumber: string
  landlord?: User
  room?: Room | null
  user?: User
  payments?: Payment[]
}

export interface Payment {
  id: string
  amount: number
  dueDate: string
  status: PaymentStatus
  paymentMethod?: PaymentMethod | null
  paystackReference?: string | null
  transactionRef?: string | null
  paidAt?: string | null
  landlordSettled?: boolean
  createdAt: string
  tenant?: Tenant
}

export interface BankTransferDetails {
  paymentId: string
  amount: number
  reference: string
  bankName: string
  accountNumber: string
  accountName: string
  landlordName: string
}

export interface PaystackInitResponse {
  authorizationUrl: string
  reference: string
  amount: number
}

export interface BankDetails {
  bankName: string
  accountNumber: string
  accountName: string
}

export interface DashboardStats {
  totalProperties: number
  totalRooms: number
  occupiedRooms: number
  vacantRooms: number
  totalTenants: number
  overduePayments: number
  monthlyIncome: number
}

export interface PaymentAnalytics {
  totalRevenue: number
  overduePayments: number
  unpaidPayments: number
  monthlyIncome: number
}

export interface RoomStats {
  totalRooms: number
  occupiedRooms: number
  vacantRooms: number
}

export interface CreatePropertyInput {
  name: string
  address: string
  city: string
  state: string
}

export interface UpdatePropertyInput {
  name?: string
  address?: string
  city?: string
  state?: string
}

export interface CreateRoomInput {
  roomNumber: string
  floor: number
  capacity: number
  propertyId: string
}

export interface UpdateRoomInput {
  roomNumber?: string
  floor?: number
  capacity?: number
}

export interface CreateTenantInput {
  fullName: string
  phoneNumber: string
  email: string
  password: string
}

export interface CreatePaymentInput {
  amount: number
  dueDate: string
  tenantId: number
}

export interface TenantDashboardProfile {
  profile: {
    id: number
    name: string
    phoneNumber: string
    email: string
  }
  landlord: {
    fullName: string
    email: string
  }
  room: {
    id: string
    roomNumber: string
    floor: number
    capacity: number
    isAvailable: boolean
  } | null
  property: {
    id: string
    name: string
    address: string
    city: string
    state: string
  } | null
  stats: {
    totalPayments: number
    pendingCount: number
    overdueCount: number
    paidCount: number
    outstandingBalance: number
  }
  recentPayments: {
    id: string
    amount: number
    dueDate: string
    status: PaymentStatus
  }[]
}

export interface AssignTenantInput {
  tenantId: number
}

export type VisitorStatus = 'PENDING' | 'ACKNOWLEDGED'

export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'

export type ComplaintCategory =
  | 'MAINTENANCE'
  | 'NOISE'
  | 'SECURITY'
  | 'UTILITIES'
  | 'OTHER'

export interface Visitor {
  id: string
  visitorName: string
  visitorPhone?: string
  visitDate: string
  expectedArrival?: string
  purpose?: string
  notes?: string
  status: VisitorStatus
  createdAt: string
  tenant?: Tenant
}

export interface Complaint {
  id: string
  title: string
  description: string
  category: ComplaintCategory
  status: ComplaintStatus
  landlordFeedback?: string | null
  feedbackAt?: string | null
  createdAt: string
  updatedAt: string
  tenant?: Tenant
}

export interface CreateVisitorInput {
  visitorName: string
  visitorPhone?: string
  visitDate: string
  expectedArrival?: string
  purpose?: string
  notes?: string
}

export interface CreateComplaintInput {
  title: string
  description: string
  category?: ComplaintCategory
}

export interface ComplaintFeedbackInput {
  landlordFeedback: string
  status?: ComplaintStatus
}
