export enum UserRole {
  PATIENT = 'PATIENT',
  PHARMACIST = 'PHARMACIST',
  ADMIN = 'ADMIN'
}

export enum MedicineCategory {
  OTC = 'Over The Counter',
  PRESCRIPTION = 'Prescription Only',
  SUPPLEMENTS = 'Vitamins & Supplements',
  BABY_CARE = 'Baby Care',
  DIABETES = 'Diabetes Care'
}

export interface Medicine {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  stock: number;
  requiresPrescription: boolean;
  category: MedicineCategory;
  description: string;
  imageUrl: string;
}

export interface CartItem extends Medicine {
  quantity: number;
}

export enum OrderStatus {
  PENDING_VERIFICATION = 'Pending Verification',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  PACKED = 'Packed',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered'
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  prescriptionUrl?: string; // Mock URL for uploaded file
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}