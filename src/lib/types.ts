
export type Role = 
  | 'Analyst' 
  | 'QC Manager' 
  | 'Admin'
  | 'Viewer'
  | 'QC Director'
  | 'Director'
  | 'COO'
  | 'CEO';

export interface User {
  id: number;
  name: string;
  username: string;
  role: Role;
  avatar: string;
}

export interface TestResult {
  value: number | string;
  unit: string;
  spec: string;
  status: 'Pass' | 'Fail' | 'Pending';
}

export type AnalysisType = 
  | 'Raw Material'
  | 'In-Process'
  | 'Incoming Pre-Shipment'
  | 'Outgoing Pre-Shipment'
  | 'Finished Product'
  | 'By-Product'
  | 'Export'
  | 'Essential Oil';

export type ProductCategory = 'Raw Material' | 'Finished Product' | 'Essential Oil';

export interface Sample {
  id: string;
  product: string;
  lot: string;
  supplier?: string;
  client?: string;
  result: 'Approved' | 'Pending Review' | 'Out of Spec';
  status: 'Approved' | 'Pending Approval' | 'Rejected';
  analyst: string;
  date: string;
  type: AnalysisType;
  priority: 'Normal' | 'High' | 'Critical';
  testResults: Record<string, TestResult>;
  overallResult: string;
  rejectionReason?: string;
  // Optional detailed fields
  dateReceived?: string;
  analysisDate?: string;
  shift?: 'Day' | 'Night';
  interval?: '1st 4 hours' | '2nd 4 hours' | '3rd 4 hours' | '';
  category?: ProductCategory;
  recoverySKR?: number;
  viableRecovery?: number;
  color?: string;
  odor?: string;
  destination?: string;
  sediments?: string;
  exportNumber?: string;
  countryOfOrigin?: string;
  supplierLotNumber?: string;
  analysisRequested?: string;
  foreignMatter?: string;
  specificGravity?: number;
  opticalRotation?: number;
  density?: number;
  comments?: string;
}

export interface AnalysisData {
  name: string;
  completed: number;
  pending: number;
  approved: number;
  outOfSpec: number;
}

export interface TrendData {
  month: string;
  passRate: number;
  volume: number;
}

export interface StatusData {
  name: string;
  value: number;
}

export interface ConsumptionLog {
  date: string;
  amount: number;
  productAnalyzed: string;
}

export interface InventoryItem {
  name: string;
  totalStock: number;
  currentStock: number;
  unit: string;
  status: 'Critical' | 'Low' | 'OK';
  consumption: ConsumptionLog[];
}

export interface Specification {
  id: string;
  label: string;
  spec: string;
  unit: string;
}

export interface ProductSpecification {
  productName: string;
  analysisType: AnalysisType | ProductCategory;
  parameters: Specification[];
}
